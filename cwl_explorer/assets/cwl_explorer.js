"use strict";

document.addEventListener("DOMContentLoaded", function() { main(); })


function input_metadata(node) {
    const properties = ["label", "secondaryFiles", "streamable",
	                "doc", "format", "inputBinding", "default", "type"];
    const result = {};
    for (var i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (node.hasOwnProperty(property)) {
            result[property] = node[property];
        }
    }
    return result;
}

/*
    InputParameter

    We only consider normalised InputParameters here.

    Each normalised InputParameter has:

    Required properties:

    id:             string

    Optional properties:

    label:          string

    secondaryFiles:	string | Expression | array<string | Expression>

    streamable:     boolean

    doc:            string | array<string>

    format:         string | array<string> | Expression

    inputBinding:   CommandLineBinding

    default:        Any

    type:           CWLType | InputRecordSchema | InputEnumSchema |
                    InputArraySchema | string |
                    array<CWLType | InputRecordSchema | InputEnumSchema |
                            InputArraySchema | string>
*/

function process_inputs(parent_id, inputs) {
    return inputs.map(function (input_object) {
        return {
            data: {
                parent: parent_id,
                id: input_object.id,
                render_id: render_id(input_object.id),
                cy_class: 'input',
                //Metadata for visualisation
                metadata: input_metadata(input_object),
            },
            classes: 'input',
            group: 'nodes',
           
        };
    });
}

function get_input_ids(inputs) {
    const ids = inputs.map(function (input_object) { return input_object.id; });
    return new Set(ids);
}

function output_metadata(node) {
    const properties = ["label", "secondaryFiles", "streamable", "doc", "format", "outputBinding", "linkMerge", "type"];
    const result = {};
    for (var i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (node.hasOwnProperty(property)) {
            result[property] = node[property];
        }
    }
    return result;
}

/*
    WorkflowOutputParameter

    We only consider normalised WorkflowOutputParameters here.

    Each normalised WorkflowOutputParameter has:

    Required properties:

    id:             string

    Optional properties:

    label:          string

    secondaryFiles:	string | Expression | array<string | Expression>

    streamable:     boolean

    doc:            string | array<string>

    outputBinding:	CommandOutputBinding

    format:	        string | Expression	False

    outputSource:	string | array<string>

    linkMerge:      LinkMergeMethod

    type:           CWLType | OutputRecordSchema | OutputEnumSchema |
                    OutputArraySchema | string |
                    array<CWLType | OutputRecordSchema | OutputEnumSchema |
                            OutputArraySchema | string>

*/

function process_outputs(parent_id, input_ids, outputs) {
    const elements = [];
    for (var i = 0; i < outputs.length; i++) {
        const output_object = outputs[i];
        const new_node = {
                data: {
                    parent: parent_id,
                    id: output_object.id,
                    render_id: render_id(output_object.id),
                    cy_class: 'output',
                    // Metadata for visualisation
                    metadata: output_metadata(output_object),
                },
                classes: 'output',
                group: 'nodes',
            }
        elements.push(new_node);
        const new_edge = {
                data: {
                    parent: parent_id, // Not sure if this is needed for edges
                    source: get_source(input_ids, output_object.outputSource),
                    target: output_object.id,
                    cy_class: 'edge',
                    // Metadata for visualisation
                    metadata: {
                        source: output_object.outputSource,
			target: output_object.id
                    },
                },
                group: "edges"
            };
        elements.push(new_edge);
    }
    return elements;
}

/*
    WorkflowStepInput

    We only consider normalised WorkflowStepInputs here.

    Each normalised WorflowStepInput has:

    Required properties:

    id:         string

    Optional properties:

    source:     array<string>

    linkMerge:  LinkMergeMethod

    default:    Any

    valueFrom:	string | Expression

    TODO:
        - handle defaults

*/

function process_step_inputs(input_ids, step_inputs, target_node) {
    const elements = [];
    for (var i = 0; i < step_inputs.length; i++) {
        const step_input_object = step_inputs[i];
        const sources = step_input_object.source;
        for (var j = 0; j < sources.length; j++) {
            const new_edge = {
                    data: {
                        source: get_source(input_ids, sources[j]),
                        target: target_node,
                        // Metadata for visualisation
                        cy_class: 'edge',
                        metadata: {
                            source: sources[j],
			    target: target_node + '/' + step_input_object.id,
                        },
                    },
                    group: "edges"
                };
            elements.push(new_edge);
        }
    }
    return elements;
}

function step_metadata(node) {
    const properties = ["run", "requirements", "hints", "label", "doc"];
    const result = {};
    for (var i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (node.hasOwnProperty(property)) {
            result[property] = node[property];
        }
    }
    return result;
}

function process_step_run(components, step_object) {
    const run_identity = step_object.run;
    if (components.hasOwnProperty(run_identity)) {
        const component = components[run_identity];
        const component_class = component.class;
        if (component_class === "Workflow") {
            return workflow_to_graph(components, step_object.id, component);
        }
    }
    return [];
}

/*
    Process WorkflowSteps

    We only consider normalised steps here.

    Each normalised WorflowStep has:

    Required properties:

    id:     string

    in:     array<WorkflowStepInput>

    out:    array<string | WorkflowStepOutput>

    run:	string | CommandLineTool | ExpressionTool | Workflow

    Optional properties:

    requirements:   array<InlineJavascriptRequirement | SchemaDefRequirement |
                    DockerRequirement | SoftwareRequirement |
                    InitialWorkDirRequirement | EnvVarRequirement |
                    ShellCommandRequirement | ResourceRequirement |
                    SubworkflowFeatureRequirement | ScatterFeatureRequirement |
                    MultipleInputFeatureRequirement |
                    StepInputExpressionRequirement>

    hints:  array<Any>

    label:  string

    doc:    string	False

    scatter:    string | array<string>

    scatterMethod:  ScatterMethod

    TODO:
        - Do something with the outputs
        - Add metadata to the node, where available
*/

function process_steps(components, parent_id, input_ids, steps) {
    const elements = [];
    for (var i = 0; i < steps.length; i++) {
        var step_object = steps[i];
        const new_node = {
                data: {
                    parent: parent_id,
                    id: step_object.id,
                    render_id: render_id(step_object.id),
                    // Metadata for visualisation
                    cy_class: 'step',
                    metadata: step_metadata(step_object),
                },
                classes: "step",
                group: "nodes",
            }
        elements.push(new_node);
        elements.push.apply(elements, process_step_inputs(input_ids, step_object.in, step_object.id));
        elements.push.apply(elements, process_step_run(components, step_object));
    }
    return elements;
}

/*
    Convert a Workflow into a Cytoscape graph_elements

    Worflow properties are below. We show only the normalised form.

    inputs:     array<InputParameter> (normalised)

    outputs:    array<WorkflowOutputParameter> (normalised)

    class:      string

    steps:      array<WorkflowStep>	(normalised)

    id:         string

    requirements:   array<InlineJavascriptRequirement | SchemaDefRequirement |
                    DockerRequirement | SoftwareRequirement |
                    InitialWorkDirRequirement | EnvVarRequirement |
                    ShellCommandRequirement | ResourceRequirement |
                    SubworkflowFeatureRequirement |
                    ScatterFeatureRequirement |
                    MultipleInputFeatureRequirement |
                    StepInputExpressionRequirement>

    hints:          array<Any>

    label:          string

    doc:            string

    cwlVersion:     CWLVersion
*/

function workflow_to_graph(components, parent_id, workflow) {
    const normalised_workflow = normalise_workflow(workflow);
    const input_elements = process_inputs(parent_id, normalised_workflow.inputs);
    const input_ids = get_input_ids(normalised_workflow.inputs);
    const output_elements = process_outputs(parent_id, input_ids, normalised_workflow.outputs);
    const step_elements = process_steps(components, parent_id, input_ids, normalised_workflow.steps);
    return input_elements.concat(output_elements, step_elements);
}

/* Convert a YAML file (as a string) into a javascript object */
function load_cwl(cwl_contents_str) {
    return jsyaml.safeLoad(cwl_contents_str);
}

/* For display purposes, just show the last part of an identifier name.

   foo/bar/ram, will be rendered just as ram.
*/

function render_id(identifier) {
    const items = identifier.split('/');
    return items[items.length - 1];
}

/*
   Get the id for an edge source.

   If the id refers to a Workflow input, then we return it unchanged (since
   it refers to a node in the output graph). Otherwise it refers to the output
   of a step, and so we drop the last part of the name, because we want to refer
   just to the step node, not the output item itself. This may change if we give step
   outputs their own nodes.
*/

function get_source(input_ids, source_string) {
    if (input_ids.has(source_string)) {
        return source_string;
    }
    else {
        const items = source_string.split('/');
        const all_but_last = items.slice(0, items.length - 1);
        const result = all_but_last.join('/');
        return result; 
   }
}

function cytoscape_settings (container, graph_elements) {
    return {
        layout: {
            name: 'dagre',
        },

        style: [
            {
                selector: ".output",
                style: {
                    shape: 'roundrectangle',
                    'background-color': '#99ccff',
                    label: 'data(render_id)',
                    'text-valign': 'center',
                    'text-halign' : 'center',
                    width : 'label',
                    'padding': 10,
                }
            },
            {
                selector: ".input",
                style: {
                    shape: 'roundrectangle',
                    'background-color': '#cccc99',
                    label: 'data(render_id)',
                    'text-valign': 'center',
                    'text-halign' : 'center',
                    width : 'label',
                    'padding': 10,
                }
            },
            {
                selector: ".step",
                style: {
                    shape: 'roundrectangle',
                    'background-color': '#ccff66',
                    label: 'data(render_id)',
                    'text-valign': 'center',
                    'text-halign' : 'center',
                    width : 'label',
                    'padding': 10,
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'curve-style': 'bezier', // This is needed to make the arrow-heads appear
                    'target-arrow-shape': 'triangle'
                }
            },
            {
                selector: ':parent',
                style: {
                    'background-opacity': 0.333,
                    'text-valign': 'top',
                }
            },
            {
                selector: "node.cy-expand-collapse-collapsed-node",
                style: {
                    "background-color": '#ccff66',
                    "shape": "rectangle"
                }
            },
        ],
        container: container,
        elements: graph_elements,
    };
}

function node_qtip_text(node) {
    const rows = [];
    const identity = "<tr><td>identity</td><td>" + node.data('id') + "</td></tr>";
    const metadata = node.data('metadata');
    rows.push(identity);
    // Construct an qtip string for each metadata field in the element
    for (var property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            const new_row = "<tr><td>" + property + "</td><td>" + metadata[property] + "</td></tr>";
            rows.push(new_row);
        }
    }
    // XXX fix styling of the qtip table
    return '<table class=\"cwl_explorer_qtip_table\">' + rows.join('') + "</table>";
}

function add_qtips_to_nodes(cy) {
    cy.nodes().forEach(function(ele) {
        ele.qtip({
             content: {
                 text: node_qtip_text(ele),
                 title: 'workflow ' + ele.data('cy_class')
             },
             style: {
                 classes: 'qtip-bootstrap'
             },
             position: {
                 my: 'bottom center',
                 at: 'top center',
                 target: ele
             }
        });
    });
}

function edge_qtip_text(node) {
    const rows = [];
    const metadata = node.data('metadata');
    // Construct an qtip string for each metadata field in the element
    for (var property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            const new_row = "<tr><td>" + property + "</td><td>" + metadata[property] + "</td></tr>";
            rows.push(new_row);
        }
    }
    // XXX fix styling of the qtip table
    return '<table class=\"cwl_explorer_qtip_table\">' + rows.join('') + "</table>";
}

function add_qtips_to_edges(cy) {
    cy.edges().forEach(function(ele) {
        ele.qtip({
             content: {
                 text: edge_qtip_text(ele),
                 title: 'workflow edge'
             },
             style: {
                 classes: 'qtip-bootstrap'
             },
             position: {
                 my: 'bottom center',
                 at: 'top center',
                 target: ele
             }
        });
    });
}

function add_expand_collapse(cy) {
    var api = cy.expandCollapse({
        layoutBy: {
            name: "dagre",
            //animate: true,
            //randomize: false, 
            fit: true,
            rankDir: 'TB'
        },
        //fisheye: false,
        animate: false,
        undoable: false
   });
   api.collapseAll();
}

function render_workflow() {
    const components = get_components();
    const main_workflow = components['#main'];
    const graph_elements = workflow_to_graph(components, null, main_workflow);
    const container = document.getElementById('cy');
    const cy = cytoscape(cytoscape_settings(container, graph_elements));
    add_qtips_to_nodes(cy);
    add_qtips_to_edges(cy);
    add_expand_collapse(cy);
    cy.resize();
}

/* Produce a map of all the components of a workflow.
   
   Assumes the input workflow is assigned to the global
   constant "input_workflow", which contains
   a list of workflow components assigned to the property
   "$graph".

  Output is a mapping from component identifier to
  component value
*/ 

function get_components() {
    const component_list = input_workflow["$graph"];
    const component_map = {};
    for (var i = 0; i < component_list.length; i++) {
        const this_component = component_list[i];
        component_map[this_component.id] = this_component;
    }
    return component_map;
}

/*
    Entry point for rendering the page
*/
function main() {
    $(document).ready(function () {
        render_workflow();
    });
}

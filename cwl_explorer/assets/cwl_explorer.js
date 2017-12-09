"use strict";

document.addEventListener("DOMContentLoaded", function() { main(); })


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
                //Metadata for visualisation
                metadata: {
                    element_type: 'input',
                    cwl_element: input_object
                }
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

    outputSource:	array<string>

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
                    metadata: {
                        element_type: 'output',
                        cwl_element: output_object
                    }
                },
                classes: 'output',
                group: 'nodes',
            }
        elements.push(new_node);
	// Add an edge to every outputSource (there could be 1 or more)
	for (var j = 0; j < output_object.outputSource.length; j++) {
            const outputSourceName = output_object.outputSource[j];	
            const new_edge = {
                    data: {
                        source: get_source(input_ids, outputSourceName),
                        target: output_object.id,
                        metadata: {
                            element_type: 'edge',
                            cwl_source_id: output_object.outputSource,
    			    cwl_target_id: output_object.id
                        },
                    },
                    group: "edges"
                };
            elements.push(new_edge);
	}
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
                        metadata: {
                            element_type: 'edge',
                            cwl_source_id: sources[j],
			    cwl_target_id: step_input_object.id,
                        },
                    },
                    group: "edges"
                };
            elements.push(new_edge);
        }
    }
    return elements;
}

function is_workflow_step(components, step_object) {
    const run_identity = step_object.run;
    if (components.hasOwnProperty(run_identity)) {
        const component = components[run_identity];
        const component_class = component.class;
        if (component_class === "Workflow") {
            return true;
        }
    }
    return false;
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
        - XXX find the run command and display information about that, if the
          run command is a command line tool.
*/

function process_steps(components, parent_id, input_ids, steps) {
    const elements = [];
    for (var i = 0; i < steps.length; i++) {
        var step_object = steps[i];

        if (is_workflow_step(components, step_object)) {
            var new_node = {
                    data: {
                        parent: parent_id,
                        id: step_object.id,
                        render_id: render_id(step_object.id),
                        metadata: {
                            element_type: 'subworkflow',
                            cwl_element: step_object
                        }
                    },
                    classes: "workflow",
                    group: "nodes",
                }
        }

        else {
            var new_node = {
                    data: {
                        parent: parent_id,
                        id: step_object.id,
                        render_id: render_id(step_object.id),
                        metadata: {
                            element_type: 'step',
                            cwl_element: step_object
                        }
                    },
                    classes: "step",
                    group: "nodes",
                }
        }
        elements.push(new_node);
        elements.push.apply(elements, process_step_inputs(input_ids, step_object.in, step_object.id));
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
                    'background-color': '#f2d388',
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
                    'background-color': '#cae4db',
                    label: 'data(render_id)',
                    'text-valign': 'center',
                    'text-halign' : 'center',
                    width : 'label',
                    'padding': 10,
                }
            },
            {
                selector: ".workflow",
                style: {
                    shape: 'roundrectangle',
                    'background-color': '#a9b7c0',
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
                    'background-color': '#c98474',
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
        ],
        container: container,
        elements: graph_elements,
    };
}

// Return a list of properties that we want to display for a given element type
function element_properties(element_type) {
    switch (element_type) {
        case "workflow":
            return ["id", "label", "doc"];
            break;
        case "input":
           return ["id", "label", "type", "format", "doc"];
           break;
        case "output":
           return ["id", "label", "type", "format", "doc"];
            break;
        case "subworkflow":
            return ["id", "run"];
            break;
        case "step":
            return ["id", "label", "run", "doc"] 
            break;
        default:
            return [] 
            break;
    }
}

function drop_hash_from_id(identifier) {
    // Drop the # from the start of the run id
    // the # is added by cwltool --pack, but the '#' causes trouble
    // with the URL query string, so we remove it
    if (identifier.length > 0 && identifier[0] == '#') {
        return identifier.substring(1);
    }
}

// Custom display for a property of a given element type
function custom_value(element_type, property, value) {
    if (element_type === "subworkflow" && property === "run") {
        value = drop_hash_from_id(value);
        return '<a href="?workflow=' + value + '">' + value + '</a>';
    }
    else if (property === "id") {
        return drop_hash_from_id(value);
    }
    else if (property === "format" && value.startsWith("edam:")) {
        const edam_format_id = value.substring("edam:".length);
        return '<a href="http://edamontology.org/' + edam_format_id + '">' + value + '</a>';
    }
    else {
        return value;
    }
}

function metadata_table(cwl_element, element_type) {
    const rows = [];
    const properties = element_properties(element_type);
    for (var i = 0; i < properties.length; i++) {
        const property = properties[i];
        var value = '';
        if (property in cwl_element && cwl_element[property] != null) {
            value = cwl_element[property];
        }
        const display_value = custom_value(element_type, property, value);
        var new_row = "<tr><td>" + property + "</td><td>" + display_value + "</td></tr>";
        rows.push(new_row);
    }
    return rows.join('');
}


// Add an event handler to nodes in the graph specifying what to do when the node is tapped
// by the user
function node_on_tap_handler(cy) {
   cy.on('tap', 'node', function (evt) {
      var this_component = evt.cyTarget;
      var metadata = this_component.data('metadata');
      // Show the type (cy_class) of node 
      $('#element-metadata-type').text(metadata.element_type);
      // Show the metadata for this node 
      $('#element-metadata tbody').html(metadata_table(metadata.cwl_element, metadata.element_type));
    });
}

function display_workflow_metadata(workflow) {
   $('#workflow-metadata tbody').html(metadata_table(workflow, "workflow"));
}

function render_workflow() {
    var urlParams = new URLSearchParams(window.location.search);

    const components = get_components();

    // This is the default top-level workflow ID
    var workflow_id = '#main';

    // Check if the URL has a parameter specifying which workflow to view
    if (urlParams.has('workflow')) {
        var workflow_id = '#' + urlParams.get('workflow');
    }

    if (workflow_id in components) {
        // Lookup this workflow in list of CWL components 
        const this_workflow = components[workflow_id];
        display_workflow_metadata(this_workflow);
        // Make sure we are working with a Workflow object and not something else
        if ("class" in this_workflow && this_workflow["class"] === "Workflow") {
            const graph_elements = workflow_to_graph(components, null, this_workflow);
            const container = document.getElementById('cy');
            const cy = cytoscape(cytoscape_settings(container, graph_elements));
            node_on_tap_handler(cy);
            cy.resize();
        }
    }
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

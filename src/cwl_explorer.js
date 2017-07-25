"use strict";

document.addEventListener("DOMContentLoaded", function() { main(); })

// XXX do we really need this?
var edge_counter = 0;

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

function process_inputs(inputs) {
    return inputs.map(function (input_object) {
        return {
            data: { id: input_object.id },
            classes: 'input'
        };
    });
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

function process_outputs(outputs) {
    const elements = [];
    for (var i = 0; i < outputs.length; i++) {
        const output_object = outputs[i];
        const new_node = {
                data: { id: output_object.id },
                classes: 'output'
            }
        elements.push(new_node);
        const new_edge = {
                data: {
                        id: edge_counter,
                        source: get_source(output_object.outputSource),
                        target: output_object.id
                }
            };
        edge_counter++;
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

function process_step_inputs(step_inputs, target_node) {
    const elements = [];
    for (var i = 0; i < step_inputs.length; i++) {
        const step_input_object = step_inputs[i];
        const sources = step_input_object.source;
        for (var j = 0; j < sources.length; j++) {
            const new_edge = {
                    data: {
                        id: edge_counter,
                        source: get_source(sources[j]),
                        target: target_node
                    }
                };
            edge_counter++;
            elements.push(new_edge);
        }
    }
    return elements;
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

function process_steps(steps) {
    const elements = [];
    for (var i = 0; i < steps.length; i++) {
        var step_object = steps[i];
        const new_node = {
                data: { id: step_object.id },
                classes: "step"
            }
        elements.push(new_node);
        elements.push.apply(elements, process_step_inputs(step_object.in, step_object.id));
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

function workflow_to_graph(data) {
    const workflow = load_cwl(data);
    const normalised_workflow = normalise_workflow(workflow);
    dump(normalised_workflow);
    const input_elements = process_inputs(normalised_workflow.inputs);
    const output_elements = process_outputs(normalised_workflow.outputs);
    const step_elements = process_steps(normalised_workflow.steps);
    return input_elements.concat(output_elements, step_elements);
}

/* Convert a YAML file (as a string) into a javascript object */
function load_cwl(cwl_contents_str) {
    return jsyaml.safeLoad(cwl_contents_str);
}

function get_source(source_string) {
    return source_string.split('/')[0];
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
                    label: 'data(id)',
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
                    label: 'data(id)',
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
                    label: 'data(id)',
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
            }
        ],
        container: container,
        elements: graph_elements,
    };
}

function render_workflow(cwl_workflow_source_str) {
    const graph_elements = workflow_to_graph(cwl_workflow_source_str);
    const container = document.getElementById('cy');
    const cy = cytoscape(cytoscape_settings(container, graph_elements));
    cy.nodes().forEach(function(ele) {
        ele.qtip({
          content: {
            //text: qtipText(ele),
            text: 'hello',
            //title: ele.data('fullName')
            title: 'Title'
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
    cy.resize();
}

function workflow_url_action () {
    var cwl_workflow_url = "";
    $('#workflow_url_button').click(function () {
        cwl_workflow_url = $('#workflow_url').val()
        if (cwl_workflow_url !== "") {
            $.get(cwl_workflow_url).done(function (workflow_source) {
                //dump(workflow_source);
                render_workflow(workflow_source);
            })
            .fail(function (error) {
                alert(error);
            });
        }
    });
}

function render_example() {
    var example_choice = $('#example_choice').val();
    if (example_choice === "example_1") {
        render_workflow(example_cwl_1);
    }
    else {
        render_workflow(example_cwl_2);
    }
}

function workflow_example_choice_action () {
    $("#example_choice").change(function () {
        render_example();
    });
}

/*
    Entry point for rendering the page
*/
function main() {
    $(document).ready(function () {
        // Action to carry out if a URL is entered and drawn
        workflow_url_action();
        // Action to carry out if user selects example from menu
        workflow_example_choice_action();
        // By default render an example
        render_example();
    });
}

/* Some example CWL files as strings for testing and demonstration */

const example_cwl_1 = "cwlVersion: v1.0\nclass: Workflow\ninputs:\n  inp: File\n  ex: string\n\noutputs:\n  classout:\n    type: File\n    outputSource: compile/classfile\n\nsteps:\n  untar:\n    run: tar-param.cwl\n    in:\n      tarfile: inp\n      extractfile: ex\n    out: [example_out]\n\n  compile:\n    run: arguments.cwl\n    in:\n      src: untar/example_out\n    out: [classfile]\n";

const example_cwl_2 = "#!/usr/bin/env cwl-runner\n\ncwlVersion: v1.0\n\nclass: Workflow\n\nrequirements:\n - class: StepInputExpressionRequirement\n - class: MultipleInputFeatureRequirement\n\ninputs:\n  - id: bai_path\n    type: File\n  - id: bam_path\n    type: File\n  - id: input_state\n    type: string\n  - id: uuid\n    type: string\n\noutputs:\n  - id: merge_sqlite_destination_sqlite\n    type: File\n    outputSource: merge_sqlite/destination_sqlite\n\nsteps:\n  - id: bai_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bai_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bai_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bai_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: bam_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bam_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bam_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bam_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: merge_sqlite\n    run: ../../tools/merge_sqlite.cwl\n    in:\n      - id: source_sqlite\n        source: [\n        bai_integrity_to_db/OUTPUT,\n        bam_integrity_to_db/OUTPUT\n        ]\n      - id: uuid\n        source: uuid\n    out:\n      - id: destination_sqlite\n      - id: log\n"

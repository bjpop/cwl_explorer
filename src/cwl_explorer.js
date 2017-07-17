"use strict";

document.addEventListener("DOMContentLoaded", function() { main(); })

var edge_counter = 0;

function load_cwl(cwl_contents_str) {
    return jsyaml.safeLoad(cwl_contents_str);
}

function process_inputs(inputs, elements) {
    for (var i = 0; i < inputs.length; i++) {
        var input_object = inputs[i];
        const new_data =
            {   data: { id: input_object.id },
                classes: 'input'
            };
        elements.push(new_data);
    }
}

function process_outputs(outputs, elements) {
    for (var i = 0; i < outputs.length; i++) {
        var output_object = outputs[i];
        const new_node =
            { data:
                { id: output_object.id },
                classes: 'output'
            }
        elements.push(new_node);
        const new_edge =
            { data:
                { id: edge_counter,
                  source: get_source(output_object.outputSource),
                  target: output_object.id
                }
            };
        edge_counter++;
        elements.push(new_edge);
    }
}

function get_source(source_string) {
    return source_string.split('/')[0];
}

function process_step_inputs(step_inputs, target_node, elements) {
    for (var i = 0; i < step_inputs.length; i++) {
        const step_input_object = step_inputs[i];
        const sources = step_input_object.source;
        for (var j = 0; j < sources.length; j++) {
            var new_edge =
                { data:
                    { id: edge_counter,
                      source: get_source(sources[j]),
                      target: target_node
                    }
                };
            edge_counter++;
            elements.push(new_edge);
        }
    }
}

function process_steps(steps, elements) {
    for (var i = 0; i < steps.length; i++) {
        var step_object = steps[i];
        const new_node =
            { data:
                { id: step_object.id },
                classes: "step"
            }
        elements.push(new_node);
        process_step_inputs(step_object.in, step_object.id, elements);
    }
}

function process_cwl(data) {
    const graph_elements = [];
    const workflow = load_cwl(data);
    const normalised_workflow = normalise_workflow(workflow);
    //dump(normalised_workflow);
    process_inputs(normalised_workflow.inputs, graph_elements);
    process_outputs(normalised_workflow.outputs, graph_elements);
    process_steps(normalised_workflow.steps, graph_elements);
    return graph_elements;
}

/*
function process_cwl(data) {
    const cwl_object = load_cwl(data);
    const graph_elements = [];
    process_inputs(cwl_object.inputs, graph_elements);
    process_outputs(cwl_object.outputs, graph_elements);
    process_steps(cwl_object.steps, graph_elements);
    return graph_elements;
}
*/

function render_workflow(cwl_workflow_source_str){
    const graph_elements = process_cwl(cwl_workflow_source_str);
    var cy = cytoscape({
        layout: {
            name: 'dagre',
        },
        style: [
    /*
            {
                selector: 'node',
                style: {
                    shape: 'roundrectangle',
                    'background-color': '#cccc99',
                    label: 'data(id)'
                }
            },
     */
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
        container: document.getElementById('cy'),
        elements: graph_elements
    });

    cy.resize();
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

function main(){
    var cwl_workflow_url = "";
    $(document).ready(function () {
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
            $("#example_choice").change(function () {
                render_example();
        });
        render_example();
    });
}

const example_cwl_1 = "cwlVersion: v1.0\nclass: Workflow\ninputs:\n  inp: File\n  ex: string\n\noutputs:\n  classout:\n    type: File\n    outputSource: compile/classfile\n\nsteps:\n  untar:\n    run: tar-param.cwl\n    in:\n      tarfile: inp\n      extractfile: ex\n    out: [example_out]\n\n  compile:\n    run: arguments.cwl\n    in:\n      src: untar/example_out\n    out: [classfile]\n";

const example_cwl_2 = "#!/usr/bin/env cwl-runner\n\ncwlVersion: v1.0\n\nclass: Workflow\n\nrequirements:\n - class: StepInputExpressionRequirement\n - class: MultipleInputFeatureRequirement\n\ninputs:\n  - id: bai_path\n    type: File\n  - id: bam_path\n    type: File\n  - id: input_state\n    type: string\n  - id: uuid\n    type: string\n\noutputs:\n  - id: merge_sqlite_destination_sqlite\n    type: File\n    outputSource: merge_sqlite/destination_sqlite\n\nsteps:\n  - id: bai_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bai_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bai_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bai_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: bam_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bam_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bam_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bam_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: merge_sqlite\n    run: ../../tools/merge_sqlite.cwl\n    in:\n      - id: source_sqlite\n        source: [\n        bai_integrity_to_db/OUTPUT,\n        bam_integrity_to_db/OUTPUT\n        ]\n      - id: uuid\n        source: uuid\n    out:\n      - id: destination_sqlite\n      - id: log\n"

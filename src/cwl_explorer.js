"use strict";

document.addEventListener("DOMContentLoaded", function() { main(); })

var edge_counter = 0;

function load_cwl(cwl_contents_str) {
    return jsyaml.safeLoad(cwl_contents_str);
}

function normalise_workflow_inputs(object) {
    if (! Array.isArray(object)) {
	var result = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
	        const value = object[property];
		const new_data = { id: property, type: value }
		result.push(new_data);
	    }
	}
	return result;
    }
    else {
        return object;
    }
}

function normalise_step_input_sources(object) {
    // Make sure the source is always an array
    if (Array.isArray(object) ) {
        return object;
    }
    else {
        return [object];
    }
}

function normalise_step_inputs(object) {
    if (! Array.isArray(object)) {
	var result = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
	        const value = object[property];
		const new_data = { id: property, source: value}
		result.push(new_data);
	    }
	}
	return result;
    }
    else {
        return object;
    }
}

function map_format_to_array(object) {
    if (! Array.isArray(object)) {
	var result = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
	        const value = object[property];
		value.id = property;
		result.push(value);
	    }
	}
	return result;
    }
    else {
        return object;
    }
}

function process_inputs(cwl_inputs, elements) {
    const items = normalise_workflow_inputs(cwl_inputs);
    for (var i = 0; i < items.length; i++) {
        var input_object = items[i];
        const new_data =
	    { data:
	        { id: input_object.id },
	      classes: 'input'
	    };
        elements.push(new_data);
    }
}

function process_outputs(cwl_outputs, elements) {
    const items = map_format_to_array(cwl_outputs);
    for (var i = 0; i < items.length; i++) {
        var output_object = items[i];
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
    const items = normalise_step_inputs(step_inputs);
    for (var i = 0; i < items.length; i++) {
	const step_input_object = items[i];
	const sources = normalise_step_input_sources(step_input_object.source);
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
/*
    for (var property in step_inputs) {
        if (step_inputs.hasOwnProperty(property)) {
            const new_edge =
                { data:
                    { id: edge_counter,
                      source: get_source(step_inputs[property]),
                      target: target_node 
                    }
                };
            edge_counter++;
            elements.push(new_edge);
        }
    }
*/
}

function dump(object) {
    console.log(JSON.stringify(object, null, 4));
}

function process_steps(cwl_steps, elements) {
    const items = map_format_to_array(cwl_steps);
    for (var i = 0; i < items.length; i++) {
	var step_object = items[i];
        const new_node =
	    { data:
                { id: step_object.id },
	      classes: "step"
	    }
        elements.push(new_node);
        process_step_inputs(step_object.in, step_object.id, elements);
    }
    /*
    for (var property in cwl_steps) {
        if (cwl_steps.hasOwnProperty(property)) {
            const new_node = { data: { id: property }}
            elements.push(new_node);
            process_step_inputs(cwl_steps[property].in, property, elements);
        }
    }
    */
}

function process_cwl(data) {
    const cwl_object = load_cwl(data);
    const graph_elements = [];
    process_inputs(cwl_object.inputs, graph_elements);
    process_outputs(cwl_object.outputs, graph_elements);
    process_steps(cwl_object.steps, graph_elements);
    return graph_elements;
}

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
        //$.get('https://raw.githubusercontent.com/NCI-GDC/gdc-dnaseq-cwl/master/workflows/dnaseq/integrity.cwl')
        //.done(function (data) {
            //dump(data);
	    $('#workflow_url_button').click(function () {
		cwl_workflow_url = $('#workflow_url').val()
	        console.log(cwl_workflow_url);
		if (cwl_workflow_url !== "") {
	            $.get(cwl_workflow_url).done(function (workflow_source) {
	                console.log(workflow_source);
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
            //const graph_elements = process_cwl(data);
            //const graph_elements = process_cwl(example_cwl_1);
        //});
    });
}

const example_cwl_1 = "cwlVersion: v1.0\nclass: Workflow\ninputs:\n  inp: File\n  ex: string\n\noutputs:\n  classout:\n    type: File\n    outputSource: compile/classfile\n\nsteps:\n  untar:\n    run: tar-param.cwl\n    in:\n      tarfile: inp\n      extractfile: ex\n    out: [example_out]\n\n  compile:\n    run: arguments.cwl\n    in:\n      src: untar/example_out\n    out: [classfile]\n";

const example_cwl_2 = "#!/usr/bin/env cwl-runner\n\ncwlVersion: v1.0\n\nclass: Workflow\n\nrequirements:\n - class: StepInputExpressionRequirement\n - class: MultipleInputFeatureRequirement\n\ninputs:\n  - id: bai_path\n    type: File\n  - id: bam_path\n    type: File\n  - id: input_state\n    type: string\n  - id: uuid\n    type: string\n\noutputs:\n  - id: merge_sqlite_destination_sqlite\n    type: File\n    outputSource: merge_sqlite/destination_sqlite\n\nsteps:\n  - id: bai_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bai_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_ls_l\n    run: ../../tools/ls_l.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_md5sum\n    run: ../../tools/md5sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bam_sha256\n    run: ../../tools/sha256sum.cwl\n    in:\n      - id: INPUT\n        source: bam_path\n    out:\n      - id: OUTPUT\n\n  - id: bai_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bai_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bai_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bai_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: bam_integrity_to_db\n    run: ../../tools/integrity_to_sqlite.cwl\n    in:\n      - id: input_state\n        source: input_state\n      - id: ls_l_path\n        source: bam_ls_l/OUTPUT\n      - id: md5sum_path\n        source: bam_md5sum/OUTPUT\n      - id: sha256sum_path\n        source: bam_sha256/OUTPUT\n      - id: uuid\n        source: uuid\n    out:\n      - id: OUTPUT\n\n  - id: merge_sqlite\n    run: ../../tools/merge_sqlite.cwl\n    in:\n      - id: source_sqlite\n        source: [\n        bai_integrity_to_db/OUTPUT,\n        bam_integrity_to_db/OUTPUT\n        ]\n      - id: uuid\n        source: uuid\n    out:\n      - id: destination_sqlite\n      - id: log\n"

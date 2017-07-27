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

function process_inputs(inputs) {
    return inputs.map(function (input_object) {
        return {
            data: {
                id: input_object.id,
                cy_class: 'input',
                //Metadata for visualisation
                metadata: input_metadata(input_object),
            },
            classes: 'input'
        };
    });
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

function process_outputs(outputs) {
    const elements = [];
    for (var i = 0; i < outputs.length; i++) {
        const output_object = outputs[i];
        const new_node = {
                data: {
                    id: output_object.id,
                    cy_class: 'output',
                    // Metadata for visualisation
                    metadata: output_metadata(output_object),
                },
                classes: 'output'
            }
        elements.push(new_node);
        const new_edge = {
                data: {
                    source: get_source(output_object.outputSource),
                    target: output_object.id,
                    cy_class: 'edge',
                    // Metadata for visualisation
                    metadata: {
                        source: output_object.outputSource,
			target: output_object.id
                    },
                },
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

function process_step_inputs(step_inputs, target_node) {
    const elements = [];
    for (var i = 0; i < step_inputs.length; i++) {
        const step_input_object = step_inputs[i];
        const sources = step_input_object.source;
        for (var j = 0; j < sources.length; j++) {
            const new_edge = {
                    data: {
                        source: get_source(sources[j]),
                        target: target_node,
                        // Metadata for visualisation
                        cy_class: 'edge',
                        metadata: {
                            source: sources[j],
			    target: target_node + '/' + step_input_object.id,
                        },
                    },
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
                data: {
                    id: step_object.id,
                    // Metadata for visualisation
                    cy_class: 'step',
                    metadata: step_metadata(step_object),
                },
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

function render_workflow(cwl_workflow_source_str) {
    const graph_elements = workflow_to_graph(cwl_workflow_source_str);
    const container = document.getElementById('cy');
    const cy = cytoscape(cytoscape_settings(container, graph_elements));
    add_qtips_to_nodes(cy);
    add_qtips_to_edges(cy);
    cy.resize();
}

function workflow_url_action () {
    var cwl_workflow_url = "";
    $('#workflow_url_button').click(function () {
        cwl_workflow_url = $('#workflow_url').val()
        if (cwl_workflow_url !== "") {
            $.get(cwl_workflow_url).done(function (workflow_source) {
                dump(workflow_source);
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
    else if (example_choice == "example_2") {
        render_workflow(example_cwl_2);
    }
    else {
        render_workflow(example_cwl_3);
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

const example_cwl_3 = "cwlVersion: v1.0\r\nclass: Workflow\r\nlabel: \"Detect Variants workflow\"\r\ndoc: WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe. Testing this works. Yep.\r\nrequirements:\r\n    - class: SubworkflowFeatureRequirement\r\ninputs:\r\n    forward_reads:\r\n        type: File\r\n        format: edam:format_1930  # fastq\r\n        doc:\r\n    reverse_reads:\r\n        type: File\r\n        format: edam:format_1930  # fastq\r\n        doc:\r\n    annotations_snps:\r\n        type: File\r\n        format: data_1106 # dbSNP ID\r\n        secondaryFiles: [.tbi]\r\n        doc:\r\n    annotations_indels:\r\n        type: File\r\n        secondaryFiles: [.tbi]\r\n        doc:\r\n    reference_assembly:\r\n        type: File\r\n        label: ref_assembly_buildhg19\r\n        format: data_2340 # genome build identifier\r\n        secondaryFiles: [\".fai\", \"^.dict\"]\r\n        doc:\r\n    bam:\r\n        type: File\r\n        format: edam:format_2572  # bam\r\n        secondaryFiles: [^.bai]\r\n        doc:\r\n    vcf:\r\n        type: File\r\n        format: edam:format_3016  # vcf\r\n        doc:\r\n    interval_list:\r\n        type: File\r\n        format: edam:format_3475  # tsv\r\n        doc:\r\n    target_sites:\r\n        type: File\r\n        format: edam:format_3003  # bed\r\n        doc: bed file containing coordinates for intersection of exons and library captures sites.\r\n    ucsc_exon_sites:\r\n        type: File\r\n        format: edam:format_3003  # bed\r\n        doc: bed file containing coordinates of exons downloaded from the UCSC database.\r\noutputs:\r\n    fastqc_report_forward:\r\n        type: File\r\n        outputSource: read_quality/forward_report_html\r\n        doc:\r\n    fastqc_report_reverse:\r\n        type: File\r\n        outputSource: read_quality/reverse_report_html\r\n        doc:\r\n    table:\r\n        type: File\r\n        outputSource: transcript_filter/transcript_filter_table\r\n        doc:\r\n    lovd+_report:\r\n        type: File\r\n        outputSource: variant_curation/lovd+_report\r\n\r\nsteps:\r\n    read_quality:\r\n        run: fastqc.cwl\r\n        label: \"fastQC version 0.11.5\"  ## this would normally be extracted from tools class\r\n        label_metadata: https://bio.tools/tool/BWA/version/none ## my own addition. This would normally be included in tools class\r\n        doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.\r\n        in:\r\n            forward_reads: forward_reads\r\n            reverse_reads: reverse_reads\r\n        out:\r\n           [forward_report_html, reverse_report_html]\r\n    align_to_ref:\r\n        run: align.cwl\r\n        label: \"bwa-mem version 0.7.13\"\r\n        label_metadata: https://bio.tools/tool/BWA/version/none\r\n        doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.\r\n        in:\r\n            forward_reads: [forward_reads]\r\n            reverse_reads: [reverse_reads]\r\n            reference: [reference_assembly]\r\n        out:\r\n           [ref_aligned_bam]\r\n    merge_alignments:\r\n        run: merge_alignments.cwl\r\n        label: \"picard-mergSamFiles v2.6.0\"\r\n        doc: merge individual alignments representing sequencing lanes.\r\n        in:\r\n            bam: align_to_ref/ref_aligned_bam\r\n        out:\r\n            [merged_bam]\r\n    genomic_coord_sort:\r\n        run: genomic_coord_sort.cwl\r\n        label: \"samtools version 1.3\"\r\n        label_metadata: https://bio.tools/tool/SAMtools/version/none\r\n        in:\r\n            bam: merge_alignments/merged_bam\r\n        out:\r\n            [sorted_bam]\r\n    mark_duplicates:\r\n        run: mark_duplicates.cwl\r\n        label: \"picard-markDuplicates\"\r\n        label_metadata:\r\n        doc: identify pcr duplicates and mark.\r\n        in:\r\n            bam: genomic_coord_sort/sorted_bam\r\n        out: \r\n            [deduped_bam]\r\n    realign_intervals:\r\n        run: realign_intervals.cwl\r\n        label: \"gatk-RealignerTargetCreator version 3.6\"\r\n        label_metadata: https://bio.tools/tool/gatk2_realigner_target_c/version/none\r\n        doc: identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.\r\n        in:\r\n            reference: [reference_assembly]\r\n            bam: mark_duplicates/deduped_bam\r\n            known_indel_sites: [annotations_indels]\r\n        out:\r\n            [realigned_intervals]\r\n    perform_realignment:\r\n        run: perform_realignment.cwl\r\n        label: \"gatk-IndelRealigner version 3.6\"\r\n        label_metadata: https://bio.tools/tool/gatk2_indel_realigner-IP/version/none\r\n        doc: perform realignment and generate new vcf with updated coords.\r\n        in:\r\n            reference: [reference_assembly]\r\n            bam: mark_duplicates/deduped_bam\r\n            known_indel_sites: [annotations_indels]\r\n            interval_list: realign_intervals/realigned_intervals\r\n        out:\r\n            [merged_dedup_realigned_bam]\r\n    bqsr:\r\n        run: bqsr.cwl\r\n        label: \"gatk-baseRecalibrator version 3.6\"\r\n        label_metadata: https://bio.tools/tool/gatk2_base_recalibrator-/version/none\r\n        doc: recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).\r\n        in:\r\n            reference: [reference_assembly]\r\n            bam: perform_realignment/merged_dedup_realigned_bam\r\n            known_sites: [annotations_snps, annotations_indels]\r\n        out:\r\n            [recalibrated_table]\r\n    apply_bqsr:\r\n        run: apply_bqsr.cwl\r\n        label: \"gatk-printReads version 3.6\"\r\n        label_metadata: https://bio.tools/tool/gatk2_print_reads-IP/version/none\r\n        doc: overwrite quality scores with re-calibrated values.\r\n        in:\r\n            reference: [reference_assembly]\r\n            bam: perform_realignment/merged_dedup_realigned_bam\r\n            bqsr_table: bqsr/recalibrated_table\r\n        out:\r\n            [recalibrated_bam]\r\n    call_variants:\r\n        run: call_variants.cwl\r\n        label: \"gatk-HaplotypeCaller version 3.6\"\r\n        label_metadata: https://bio.tools/tool/gatk2_haplotype_caller-I/version/none\r\n        doc: simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.\r\n        in:\r\n            reference: [reference_assembly]\r\n            bam: apply_bqsr/recalibrated_bam\r\n            annotations_snps: [annotations_snps]\r\n            bed: [target_sites]\r\n        out:\r\n            [raw_variants_bam]\r\n    genotypeGVCFs:\r\n        run: genotypeGVCFs.cwl\r\n        label: \"gatk-genotypeGVCF version 3.6\"\r\n        label_metadata:\r\n        doc: genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.\r\n        in:\r\n            reference: [reference_assembly]\r\n            annotations_snps: [annotations_snps]\r\n            variant: call_variants/raw_variants_vcf\r\n        out:\r\n            [raw_variants_gvcf]\r\n    select_indels:\r\n        run: select_indels.cwl\r\n        label: \"gatk-selectVariants version 3.6\"\r\n        label_metadata:\r\n        doc: extract indel mutations only. This is necessary so that indel-specific filters can be applied.\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: genotypeGVCFs/raw_variants_gvcf\r\n        out:\r\n            [indel_vcf]\r\n    select_snvs:\r\n        run: select_snvs.cwl\r\n        label: \"gatk-selectVariants version 3.6\"\r\n        label_metadata:\r\n        doc: extract all but indel mutations types so that hard filters can be applied.\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: genotypeGVCFs/raw_variants_gvcf\r\n        out:\r\n            [snv_vcf]\r\n    hard_filter_indels:\r\n        run: indel_hardfilter.cwl\r\n        label: \"gatk-selectVariants version 3.6\"\r\n        label_metadata:\r\n        doc: apply hard quality filters on allelic depth etc.\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: select_indels/indel_vcf\r\n        out:\r\n            [hard_filtered_indel_vcf]\r\n    hard_filter_snvs:\r\n        run: snv_hardfilter.cwl\r\n        label: \"gatk-selectVariants version 3.6\"\r\n        label_metadata:\r\n        doc: apply hard quality filters on allelic depth, etc.\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: select_snvs/snv_vcf\r\n        out:\r\n            [hard_filtered_snv_vcf]\r\n    merge_variants:\r\n        run: merge_variants.cwl\r\n        label: \"gatk-selectVariants version 3.6\"\r\n        label_metadata:\r\n        doc: merge filtered indel and snv vcfs\r\n        in:\r\n            reference: [reference_assembly]\r\n            indels: hard_filter_indels/hard_filtered_indel_vcf\r\n            snvs: hard_filter_snvs/hard_filtered_snv_vcf\r\n        out:\r\n            [merged_variants_vcf]\r\n    vcf_normalize:\r\n        run: vcf_normalize.cwl\r\n        label: \"bcftools version 1.3\"\r\n        label_metadata: https://bio.tools/tool/bcftools/version/1.2\r\n        doc: normalisation and split multi-allelic sites\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: merge_variants/merged_variants_vcf\r\n        out:\r\n            [normalized_vcf]\r\n    vcf_annotate:\r\n        run: vcf_annotate.cwl\r\n        label: \"vep version 85\"\r\n        label_format: https://bio.tools/tool/VEP/version/none%7CVEP\r\n        doc: apply variant effect prediction tools and populate the vcf file.\r\n        in:\r\n            variant: vcf_normalize/normalized_vcf\r\n        out:\r\n            [annotated_vcf]\r\n    vcf_annotate_2:\r\n        run: vcf_annotate.cwl\r\n        label: \"grantham, condel plugin\"\r\n        label_metadata:\r\n        doc: additional variant effect prediction scores\r\n        in:\r\n            variant: vcf_annotate/annotated_vcf\r\n        out:\r\n            [annotated_2_vcf]\r\n    post_annotate_vep:\r\n        run: post_annotate_vep.cwl\r\n        label: \"dbNSFP version 2.9.1\"\r\n        label_metadata:\r\n        doc: discard variants outside of non-coding regions\r\n        in:\r\n            variant: vcf_annotate_2/annotated_2_vcf\r\n        out:\r\n            [vep_annotated_vcf]\r\n    vcf_to_table:\r\n        run: vcf_to_table.cwl\r\n        label: \"vcf_to_table.py\"\r\n        label_metadata:\r\n        in:\r\n            reference: [reference_assembly]\r\n            variant: post_annotate_vep/vep_annotated_vcf\r\n        out:\r\n            [variant_table_tsv]\r\n    filter_table_forLOVD:\r\n        run: filter_table.cwl\r\n        label: \"filter.py\"\r\n        label_metadata:\r\n        in:\r\n            table: vcf_to_table/variant_table\r\n        out:\r\n            [filtered_variant_table]\r\n    lovd_table:\r\n        run: lovd_table.cwl\r\n        label: \"filter_lovd.py\"\r\n        label_metadata:\r\n        in:\r\n            variant: filter_table_forLOVD/filtered_variant_table\r\n        out:\r\n            [lovd_compatible_table]\r\n    transcript_filter:\r\n        run: transcript_table.cwl\r\n        label: \"filter.py updated XX\"\r\n        label_metadata:\r\n        in:\r\n            table: lovd_table/lovd_compatible_table\r\n        out:\r\n            [transcript_filtered_table]\r\n    gender_check:\r\n        run: karyotype.cwl\r\n        label: \"check_karyotype.py updated XX\"\r\n        label_metadata:\r\n        in:\r\n            vcf: calculate_exome_coverage/exome_coverage\r\n        out:\r\n            [karyotype_summary]\r\n    calculate_exome_coverage:\r\n        run: exome_coverage.cwl\r\n        label: \"bedtools version xx\"\r\n        label_metadata: https://bio.tools/tool/BEDTools/version/none\r\n        in:\r\n            bam: apply_bqsr/recalibrated_bam\r\n            bed: [target_sites]\r\n        out:\r\n            [exome_coverage_gz]\r\n    calculate_capture_coverage:\r\n        run: capture_coverage.cwl\r\n        label: \"calculate_exon_coverage.py version xx\"\r\n        label_metadata:\r\n        in:\r\n            exome_coverage: calculate_exome_coverage/report_summary_gz\r\n            bed: [ucsc_exon_sites]\r\n        out:\r\n            [library_coverage_txt]\r\n    calculate_read_depth:\r\n        run: read_depth.cwl\r\n        label: \"gatk-depthOfCoverage version xx\"\r\n        label_metadata: https://bio.tools/tool/gatk2_depth_of_coverage-/version/none\r\n        in:\r\n            bam: apply_bqsr/recalibrated_bam\r\n        out:\r\n            [read_coverage_summary]\r\n    insert_size_metrics:\r\n        run: insert_size_metrics.cwl\r\n        label: \"picard-collectInsertSizeMetrics version xx\"\r\n        label_metadata:\r\n        in:\r\n            bam: apply_bqsr/recalibrated_bam\r\n        out:\r\n            [insert_size_metrics_txt]\r\n    stage_report:\r\n        run: qc_report.cwl\r\n        label: \"qc_report.py version xx\"\r\n        label_metadata:\r\n        in:\r\n            gender: gender_check/karyotype_summary\r\n            exome_coverage: calculate_exome_coverage/exome_coverage_gz\r\n            library_coverage: calculate_capture_coverage/library_coverage_txt\r\n            read_coverage: calculate_read_depth/read_coverage_summary\r\n        out:\r\n            [stage_report_pdf]\r\n    variant_curation:\r\n        run: lovd.cwl\r\n        label: \"lovd+ version xx\"\r\n        label_metadata:\r\n        in:\r\n            table: filter_table_forLOVD/lovd_compatible_table\r\n            gender: gender_check/karyotype_summary\r\n            read_coverage: calculate_read_depth/read_coverage_summary\r\n            library_coverage: calculate_capture_coverage/library_coverage_txt\r\n            insert_size_metrics: insert_size_metrics/insert_size_metrics_txt\r\n            stage_report: stage_report/stage_report_pdf\r\n        out:\r\n            [lovd+_report]\r\n";

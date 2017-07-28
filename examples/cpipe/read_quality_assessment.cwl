cwlVersion: v1.0
class: Workflow
label: "read_quality_assessment"
doc:

inputs:
    forward_reads:
        type: File
        format: edam:format_1930  # fastq
        doc:
    reverse_reads:
        type: File
        format: edam:format_1930  # fastq
        doc:
outputs:
    fastqc_report_forward:
        type: File
        outputSource: read_quality/forward_report_html
        doc: 

    fastqc_report_reverse:
        type: File
        outputSource: read_quality/reverse_report_html
        doc:

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    read_quality:
        run: fastqc.cwl
        label: "fastQC version 0.11.5"  ## this would normally be extracted from tools class
        doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
        out:
           [forward_report_html, reverse_report_html]

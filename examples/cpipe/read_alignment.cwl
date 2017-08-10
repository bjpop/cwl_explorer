cwlVersion: v1.0
class: Workflow
label: "read_alignment"
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
    reference_assembly:
        type: File
        label: ref_assembly_buildhg19
        format: data_2340 # genome build identifier
        secondaryFiles: [".fai", "^.dict"]
        doc:
outputs:
    aligned_merged_bam:
        type: File
        outputSource: merge_alignments/aligned_merged_bam
        doc:

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    align_to_ref:
        run: align.cwl
        label: "bwa-mem version 0.7.13"
        doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
            reference_assembly: [reference_assembly]
        out:
           [ref_aligned_bam]
    merge_alignments:
        run: merge_alignments.cwl
        label: "picard-mergSamFiles v2.6.0"
        doc: merge individual alignments representing sequencing lanes.
        in:
            bam: align_to_ref/ref_aligned_bam
        out:
            [aligned_merged_bam]

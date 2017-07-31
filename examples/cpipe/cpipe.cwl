cwlVersion: v1.0
class: Workflow
label: "Detect Variants workflow"
doc: WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe. 
requirements:
    - class: SubworkflowFeatureRequirement

inputs:
    forward_reads:
        type: File
        format: edam:format_1930  # fastq
        doc:
    reverse_reads:
        type: File
        format: edam:format_1930  # fastq
        doc:
    annotations_snps:
        type: File
        format: data_1106 # dbSNP ID
        secondaryFiles: [.tbi]
        doc:
    annotations_indels:
        type: File
        doc:
    annotations_indels_2:
        type: File
        doc:
    reference_assembly:
        type: File
        label: ref_assembly_buildhg19
        format: data_2340 # genome build identifier
        secondaryFiles: [".fai", "^.dict"]
        doc:
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates for intersection of exons and library captures sites.
    library_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates of exons downloaded from the UCSC database.
    vep_cache:
        type: File
        format:
        doc: database of annotations.
    
outputs:
    fastqc_report_forward:
        type: File
        outputSource: read_quality_assessment/fastqc_report_forward
        doc:
    fastqc_report_reverse:
        type: File
        outputSource: read_quality_assessment/fastqc_report_reverse
        doc:
    stage_report_pdf:
        type: File
        outputSource: generate_quality_reports/stage_report_pdf
        doc:
    library_coverage_txt:
        type: File
        outputSource: generate_quality_reports/library_coverage_txt
        doc:
    read_coverage_summary:
        type: File
        outputSource: generate_quality_reports/read_coverage_summary
        doc:
    insert_size_metrics_txt:
        type: File
        outputSource: generate_quality_reports/insert_size_metrics_txt
        doc:
    transcript_filtered_table:
        type: File
        outputSource: post_annotation_processing/transcript_filtered_table
        doc:
         
steps:
    read_quality_assessment:
        run: read_quality_assessment.cwl
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
        out:
            [fastqc_report_forward, fastqc_report_reverse]
    read_alignment:
        run: read_alignment.cwl
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
            reference_assembly: [reference_assembly]
        out:
            [aligned_merged_bam]
    post_alignment_processing:
        run: post_alignment_processing.cwl
        in:
            aligned_merged_bam: read_alignment/aligned_merged_bam
            target_sites: [target_sites]
            annotations_snps: [annotations_snps]
            annotations_indels: [annotations_indels]
            reference_assembly: [reference_assembly]
        out:
            [recalibrated_bam]
    variant_calling:
        run: variant_calling.cwl
        in:
            recalibrated_bam: post_alignment_processing/recalibrated_bam
            annotations_snps: [annotations_snps]
            annotations_indels: [annotations_indels]
            annotations_indels_2: [annotations_indels_2]
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
            [raw_variants_gvcf]
    post_variant_processing:
        run: post_variant_processing.cwl
        in:
            raw_variants_gvcf: variant_calling/raw_variants_gvcf
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
             [normalized_vcf]       
    variant_annotation:
        run: variant_annotation.cwl
        in:
            normalized_vcf: post_variant_processing/normalized_vcf
            vep_cache: [vep_cache]
        out:
            [annotated_2_vcf]        
    post_annotation_processing:
        run: post_annotation_processing.cwl
        in:
            annotated_2_vcf: variant_annotation/annotated_2_vcf
        out:
            [transcript_filtered_table]
    generate_quality_reports:
        run: generate_quality_reports.cwl 
        in:
            recalibrated_bam: post_alignment_processing/recalibrated_bam
            target_sites: [target_sites]
            library_sites: [library_sites]
        out:
            [stage_report_pdf, library_coverage_txt, read_coverage_summary, insert_size_metrics_txt]

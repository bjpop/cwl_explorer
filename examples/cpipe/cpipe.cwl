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
    known_snp_sites:
        type: File
        format: data_1106 # dbSNP ID
        secondaryFiles: [.tbi]
        doc:
    known_indel_sites:
        type: File
        doc:
    annotations_indels_2: # XXX is this used anymore?
        type: File
        doc:
    reference_assembly:
        type: File
        label: ref_assembly_buildhg19
        format: data_2340 # genome build identifier
        secondaryFiles: [".fai", "^.dict"]
        doc:
    reference_assembly_2:
        type: File
        doc: This is used by VEP.
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
            known_snp_sites: [known_snp_sites]
            known_indel_sites: [known_indel_sites]
            reference_assembly: [reference_assembly]
        out:
            [recalibrated_bam, dedup_metrics]
    variant_calling:
        run: variant_calling.cwl
        in:
            recalibrated_bam: post_alignment_processing/recalibrated_bam
            known_snp_sites: [known_snp_sites]
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
            [raw_variants_g_gvcf]
    post_variant_processing:
        run: post_variant_processing.cwl
        in:
            raw_variants_g_gvcf: variant_calling/raw_variants_g_gvcf
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
             [normalized_g_vcf]       
    variant_annotation:
        run: variant_annotation.cwl
        in:
            normalized_g_vcf: post_variant_processing/normalized_g_vcf
            vep_cache: [vep_cache]
            reference_assembly_2: [reference_assembly_2]

        out:
            [vep_annotated_vcf]        
    post_annotation_processing:
        run: post_annotation_processing.cwl
        in:
            annotated_vcf: variant_annotation/vep_annotated_vcf
        out:
            [transcript_filtered_table]
    generate_quality_reports:
        run: generate_quality_reports.cwl 
        in:
            recalibrated_bam: post_alignment_processing/recalibrated_bam
            target_sites: [target_sites]
            library_sites: [library_sites]
            reference_assembly: [reference_assembly]
            dedup_metrics: [post_alignment_processing/dedup_metrics]

        out:
            [stage_report_pdf, read_coverage_summary, insert_size_metrics_txt, library_coverage_txt]

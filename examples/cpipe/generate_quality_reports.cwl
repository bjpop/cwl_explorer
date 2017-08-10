cwlVersion: v1.0
class: Workflow
label: "generate_quality_reports"
doc:

inputs:
    recalibrated_bam:
        type: File
        format: edam:format_2572 # bam
        doc:
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates for intersection of exons and library captures sites.
    library_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates of library captures sites provided by the kit manufacturer.
    dedup_metrics:
        type: File
        format: 
        doc: 
    reference_assembly:
        type: File
        format:
        doc:

outputs:
    stage_report_pdf:
        type: File
        outputSource: stage_report/stage_report_pdf
        doc: 
    read_coverage_summary:
        type: File
        outputSource: calculate_read_depth/read_coverage_summary
        doc: 
    insert_size_metrics_txt:
        type: File
        outputSource: insert_size_metrics/insert_size_metrics_txt
        doc: 
    library_coverage_txt:
        type: File
        outputSource: insert_size_metrics/insert_size_metrics_txt
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    convert_bam_to_bed:
        run: bam_quality.cwl
        label:
        in:
            recalibrated_bam: [recalibrated_bam]
        out:
            [recalibrated_bed]
    create_target_exome_bed:
        run: bam_quality.cwl
        label: "bedtools-intersect"
        in:
            target_sites: [target_sites]
            library_sites: [library_sites] ## sites targeted by the library
        out:
            [intersect_bed]
    calculate_coverage_stats:
        run: bam_quality.cwl
        label: "bedtools-coverageBed version xx"
        in:
            library_sites: convert_bam_to_bed/recalibrated_bed
            target_sites: [target_sites] ## bed file over the target sites -- this may be redunandant if list of genes not provided.
            intersect_bed: create_target_exome_bed/intersect_bed
            recalibrated_bam: [recalibrated_bam]
        out:
            [intersect_cov_gz, exome_coverage_gz, ontarget_txt]
    calculate_qc_statistics:
        run: bam_quality.cwl
        label: "samtools version xx"
        in:
            recalibrated_bam: [recalibrated_bam]
        out:
            [fragments_tsv]
    gender_check:
        run: bam_quality.cwl
        label: "check_karyotype.py updated XX"
        in:
            exome_coverage_gz: calculate_coverage_stats/exome_coverage_gz
        out:
            [karyotype_summary]
    calculate_read_depth:
        run: bam_quality.cwl
        label: "gatk-depthOfCoverage version xx"
        in:
            recalibrated_bam: [recalibrated_bam]
            reference_assembly: [reference_assembly]
        out:
            [read_coverage_summary]
    insert_size_metrics:
        run: bam_quality.cwl
        label: "picard-collectInsertSizeMetrics version xx"
        in:
            recalibrated_bam: [recalibrated_bam]
        out:
            [insert_size_metrics_txt]
    stage_report:
        run: bam_quality.cwl
        label: "qc_report.py version xx"
        in:
            dedup_metrics: [dedup_metrics]
            gender: gender_check/karyotype_summary
            exome_coverage: calculate_coverage_stats/exome_coverage_gz
            ontarget_coverage: calculate_coverage_stats/ontarget_txt
            intersect_cov_gz: calculate_coverage_stats/intersect_cov_gz
            fragments_tsv: calculate_qc_statistics/fragments_tsv
        out:
            [stage_report_pdf, read_coverage_summary]
            

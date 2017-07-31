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

outputs:
    stage_report_pdf:
        type: File
        outputSource: stage_report/stage_report_pdf
        doc: 
    library_coverage_txt:
        type: File
        outputSource: calculate_capture_coverage/library_coverage_txt
        doc: 
    read_coverage_summary:
        type: File
        outputSource: calculate_read_depth/read_coverage_summary
        doc: 
    insert_size_metrics_txt:
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
            bam: [recalibrated_bam]
        out:
            [recalibrated_bed]
    create_target_exome_bed:
        run: bam_quality.cwl
        label: "bedtools-intersect"
        in:
            bed: [target_sites]
            bed: [library_sites] ## sites targeted by the library
        out:
            [intersect_bed]
    calculate_coverage_stats:
        run: bam_quality.cwl
        label: "bedtools-coverageBed version xx"
        in:
            bed: convert_bam_to_bed/recalibrated_bed
            bed: [target_sites] ## bed file over the target sites -- this may be redunandant if list of genes not provided.
            bed: [intersect_bed] ## bed file over the exome intersect library sites
            bed: [library_sites] ## bed file over the library
            bam: recalibrated_bam
        out:
            [exome_coverage_gz, ontarget_txt]
    calculate_qc_statistics:
        run: bam_quality.cwl
        label: "samtools version xx"
        in:
            bed: [recalibrated_bam]
        out:
            [fragments_tsv]
    gender_check:
        run: bam_quality.cwl
        label: "check_karyotype.py updated XX"
        in:
            vcf: calculate_coverage_stats/exome_coverage_gz
        out:
            [karyotype_summary]
    calculate_capture_coverage:
        run: bam_quality.cwl
        label: "calculate_exon_coverage.py version xx"
        in:
            exome_coverage: calculate_coverage_stats/exome_coverage_gz
            bed: [library_sites]
        out:
            [library_coverage_txt]
    calculate_read_depth:
        run: bam_quality.cwl
        label: "gatk-depthOfCoverage version xx"
        in:
            bam: [recalibrated_bam]
        out:
            [read_coverage_summary]
    insert_size_metrics:
        run: bam_quality.cwl
        label: "picard-collectInsertSizeMetrics version xx"
        in:
            bam: [recalibrated_bam]
        out:
            [insert_size_metrics_txt]
    stage_report:
        run: bam_quality.cwl
        label: "qc_report.py version xx"
        in:
            gender: gender_check/karyotype_summary
            exome_coverage: calculate_coverage_stats/exome_coverage_gz
            ontarget_coverage: calculate_coverage_stats/ontarget_txt
            library_coverage: calculate_capture_coverage/library_coverage_txt
            read_coverage: calculate_read_depth/read_coverage_summary
            fragments_tsv: calculate_qc_statistics/fragments_tsv
        out:
            [stage_report_pdf]
            

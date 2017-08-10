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
        secondaryFiles: [.tbi]
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
        outputSource: read_quality_assessment/forward_report_html
        doc:
    fastqc_report_reverse:
        type: File
        outputSource: read_quality_assessment/reverse_report_html
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
        outputSource: post-annotation_processing/transcript_filter_table
        doc:
         
steps:
    read_quality_assessment:
        run: read_quality_assessment.cwl
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
        out:
            [forward_report_html, reverse_report_html]
    read_alignment:
        run: read_alignment.cwl
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
        out:
            [aligned_merged_bam]
    post-alignment_processing:
        run: post-alignment_processing.cwl
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
            recalibrated_bam: post-alignment_processing/recalibrated_bam
            annotations_snps: [annotations_snps]
            annotations_indels: [annotations_indels]
            annotations_indels_2: [annotations_indels_2]
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
            [raw_variants_gvcf]
    post-variant_processing:
        run: post-variant_processing.cwl
        in:
            raw_variants_gvcf: variant_calling/raw_variants_gvcf
            reference_assembly: [reference_assembly]
            target_sites: [target_sites]
        out:
             [normalized_vcf]       
    variant_annotation:
        run: variant_annotation.cwl
        in:
            normalized_vcf: post-variant_processing/normalized_vcf
            vep_cache: [vep_cache]
        out:
            [annotated_2_vcf]        
    post-annotation_processing:
        run: post-annotation_processing.cwl
        in:
            annotated_2_vcf: variant_annotation/annotated_2_vcf
        out:
            [transcript_filtered_table]        
    generate_quality_reports:
        run: generate_quality_reports.cwl 
        in:
            recalibrated_bam: post-alignment_processing/recalibrated_bam
            target_sites: [target_sites]
            library_sites: [library_sites]
        out:
            [stage_report_pdf]
            [library_coverage_txt]
            [read_coverage_summary]
            [insert_size_metrics_txt]

############################
#### Start subworkflows ####
############################


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
        run: ../tools/fastqc.cwl
        label: "fastQC version 0.11.5"  ## this would normally be extracted from tools class
        label_metadata: https://bio.tools/tool/BWA/version/none ## my own addition. This would normally be included in tools class
        doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
        out:
           [forward_report_html, reverse_report_html]


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
outputs:
    aligned_merged_bam:
        type: File
        outputSource: merge_alignments/aligned_merged_bam
        doc:

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    align_to_ref:
        run: ../tools/align.cwl
        label: "bwa-mem version 0.7.13"
        label_metadata: https://bio.tools/tool/BWA/version/none
        doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.
        in:
            forward_reads: [forward_reads]
            reverse_reads: [reverse_reads]
            reference: [reference_assembly]
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

cwlVersion: v1.0
class: Workflow
label: "post-alignment_processing"
doc:

inputs:
    aligned_merged_bam:
        type: File
        format:
        doc:
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.
    annotations_snps:
        type: File
        format: data_1106 # dbSNP ID
        secondaryFiles: [.tbi]
        doc:
    annotations_indels:
        type: File
        secondaryFiles: [.tbi]
        doc:
    reference_assembly:
        type: File
        label: ref_assembly_buildhg19
        format: data_2340 # genome build identifier
        secondaryFiles: [".fai", "^.dict"]
        doc:
outputs:
    recalibrated_bam:
        type:
        outputSource: apply_recalibration/recalibrated_bam
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    sort_bam:
        run: ../tools/genomic_coord_sort.cwl
        label: "samtools version 1.3"
        in:
            bam_file: [aligned_merged_bam]
        out:
            [sorted_aligned_bam]
    mark_duplicates:
        run: ../tools/mark_duplicates.cwl
        label: "picard-markDuplicates"
        doc: identify and mark pcr duplicates.
        in:
            sorted_aligned_bam: genomic_coord_sort/sorted_bam
        out: 
            [deduped_bam, dedup_metrics]
    realign_intervals:
        run: ../tools/realign_intervals.cwl
        label: "gatk-RealignerTargetCreator version 3.6"
        doc: identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.
        in:
            reference_assembly: [reference_assembly]
            known_indel_sites: [annotations_indels]
            target_sites: [target_sites]
            deduped_bam: mark_duplicates/deduped_bam
        out:
            [realigned_intervals]
    perform_realignment:
        run: ../tools/perform_realignment.cwl
        label: "gatk-IndelRealigner version 3.6"
        doc: perform realignment and generate new vcf with updated coords.
        in:
            reference_assembly: [reference_assembly]
            deduped_bam: mark_duplicates/deduped_bam
            target_sites: [target_sites]
            realigned_intervals: realign_intervals/realigned_intervals
        out:
            [deduped_realigned_bam]
    base_quality_recalibration:
        run: bqsr.cwl
        label: "gatk-baseRecalibrator version 3.6"
        doc: recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).
        in:
            reference_assembly: [reference_assembly]
            deduped_realigned_bam: perform_realignment/merged_dedup_realigned_bam
            known_snp_sites: [annotations_snps]
            target_sites: [target_sites]
        out:
            [recalibrated_table]
    apply_recalibration:
        run: ../tools/apply_bqsr.cwl
        label: "gatk-printReads version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_print_reads-IP/version/none
        doc: overwrite quality scores with re-calibrated values.
        in:
            reference: [reference_assembly]
            bam: perform_realignment/merged_dedup_realigned_bam
            bqsr_table: bqsr/recalibrated_table
            bed: [target_sites]
        out:
            [recalibrated_bam]

cwlVersion: v1.0
class: Workflow
label: "variant_calling"
doc:

inputs:
    annotations_snps:
        type: File
        format: data_1106 # dbSNP ID
        secondaryFiles: [.tbi]
        doc:
    annotations_indels:
        type: File
        secondaryFiles: [.tbi]
        doc:
    annotations_indels_2:
        type: File
        format: # vcf
        doc: 1000G phase 3v4
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
   recalibrated_bam:
        type:
        format:
        doc: 
outputs:
    raw_variants_gvcf:
        type: File
        outputSource: genotypeGVCFs/raw_variants_gvcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    call_variants:
        run: ../tools/call_variants.cwl
        label: "gatk-HaplotypeCaller version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_haplotype_caller-I/version/none
        doc: simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.
        in:
            reference: [reference_assembly]
            bam: {recalibrated_bam]
            known_indels: [annotations_indels]
            known_snps: [annotations_snps]
            bed: [target_sites]
        out:
            [raw_variants_vcf]
    genotypeGVCFs:
        run: genotypeGVCFs.cwl
        label: "gatk-genotypeGVCF version 3.6"
        label_metadata:
        doc: genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.
        in:
            reference: [reference_assembly]
            known_indels: [annotations_indels_2]
            variant: call_variants/raw_variants_vcf
        out:
            [raw_variants_gvcf]

cwlVersion: v1.0
class: Workflow
label: "post-variant_processing"
doc:

inputs:
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
    raw_variants_gvcf:
        type: File
        format:
        doc: 
outputs:
    normalized_vcf:
        type: File
        outputSource: vcf_normalize/normalized_vcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    select_indels:
        run: ../tools/select_indels.cwl
        label: "gatk-selectVariants version 3.6"
        label_metadata:
        doc: extract indel mutations only. This is necessary so that indel-specific filters can be applied.
        in:
            reference: [reference_assembly]
            variant: [raw_variants_gvcf]
        out:
            [indel_vcf]
    select_snvs:
        run: ../tools/select_snvs.cwl
        label: "gatk-selectVariants version 3.6"
        label_metadata:
        doc: extract all but indel mutations types so that hard filters can be applied.
        in:
            reference: [reference_assembly]
            variant: [raw_variants_gvcf]
        out:
            [snv_vcf]
    hard_filter_indels:
        run: ../tools/indel_hardfilter.cwl
        label: "gatk-selectVariants version 3.6"
        label_metadata:
        doc: apply hard quality filters on allelic depth etc.
        in:
            reference: [reference_assembly]
            variant: select_indels/indel_vcf
        out:
            [hard_filtered_indel_vcf]
    hard_filter_snvs:
        run: ../tools/snv_hardfilter.cwl
        label: "gatk-selectVariants version 3.6"
        label_metadata:
        doc: apply hard quality filters on allelic depth, etc.
        in:
            reference: [reference_assembly]
            variant: select_snvs/snv_vcf
        out:
            [hard_filtered_snv_vcf]
    merge_variants:
        run: ../tools/merge_variants.cwl
        label: "gatk-selectVariants version 3.6"
        label_metadata:
        doc: merge filtered indel and snv vcfs
        in:
            reference: [reference_assembly]
            indels: hard_filter_indels/hard_filtered_indel_vcf
            snvs: hard_filter_snvs/hard_filtered_snv_vcf
        out:
            [merged_variants_vcf]
    vcf_normalize:
        run: ../tools/vcf_normalize.cwl
        label: "bcftools version 1.3"
        label_metadata: https://bio.tools/tool/bcftools/version/1.2
        doc: normalisation and split multi-allelic sites
        in:
            reference: [reference_assembly]
            variant: merge_variants/merged_variants_vcf
        out:
            [normalized_vcf]

cwlVersion: v1.0
class: Workflow
label: "variant_annotation"
doc:

inputs:
    normalized_vcf:
        type: File
        format: edam: format_3016
        doc:
    vep_cache:
        type: File
        format: edam:format_3016
        doc:
    grantham:
        type: File
        format: edam:format_3016
        doc:
    condel:
        type: File
        format: edam:format_3016
        doc:
    dbNSFP:
        type: File
        format: edam:format_3016
        doc:
    
outputs:
    annotated_2_vcf:
        type: File
        outputSource: vcf_annotate_2/annotated_2_vcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    vcf_annotate:
        run: ../tools/vcf_annotate.cwl
        label: "vep version 85"
        label_metadata: https://bio.tools/tool/VEP/version/none%7CVEP
        doc: apply variant effect prediction tools and populate the vcf file.
        in:
            variant: vcf_normalize/normalized_vcf
            database: [vep_cache]
        out:
            [annotated_vcf]
    vcf_annotate_2:
        run: ../tools/vcf_annotate.cwl
        label: "grantham, condel plugin"
        label_metadata:
        doc: additional variant effect prediction scores
        in:
            variant: vcf_annotate/annotated_vcf
            plugin1: [grantham]
            plugin2: [dbNSFP]
            plugin3: [condel]
        out:
            [annotated_2_vcf]

cwlVersion: v1.0
class: Workflow
label: "post-annotation_processing"
doc:

inputs:
    annotated_2_vcf:
        type: File
        format: edam:format_3016
        doc:
outputs:
    transcript_filtered_table:
        type:
        outputSource: transcript_filter/transcript_filtered_table
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    post_annotate_vep:
        run: ../tools/post_annotate_vep.cwl
        label: "vep-filter_vep.pl"
        label_metadata: Standard vep extension with filter terms based on VEP developed criteria.
        doc: discard variants outside of non-coding regions. Filter based on consequence and biotype fields. Filtering performed to satisfy LOVD requirements.
        in:
            variant: vcf_annotate_2/annotated_2_vcf
        out:
            [vep_annotated_vcf]
    vcf_to_table:
        run: ../tools/post_annotate_vep.cwl
        label: "vcf_to_table.py"
        label_metadata:
        doc: convert vcf to table to satisfy formatting requirements for LOVD import.
        in:
            variant: post_annotate_vep/vep_annotated_vcf
        out:
            [variant_table_tsv]
    filter_table_forLOVD:
        run: filter_table.cwl
        label: "filter.py"
        label_metadata:
        doc: filter low quality variant (marked in vcf not removed).
        in:
            table: vcf_to_table/variant_table
        out:
            [filtered_variant_table]
    lovd_table:
        run: ../tools/post_annotate_vep.cwl
        label: "filter_lovd.py"
        label_metadata:
        doc: Expand VEP annotations across columns.
        in:
            variant: filter_table_forLOVD/filtered_variant_table
        out:
            [lovd_compatible_table]
    transcript_filter:
        run: ../tools/post_annotate_vep.cwl
        label: "filter.py updated XX"
        label_metadata:
        doc: prioritise in cases where multiple transcripts for LOVD.
        in:
            table: lovd_table/lovd_compatible_table
        out:
            [transcript_filtered_table]

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
        type:
        outputSource: stage_report/stage_report_pdf
        doc: 
    library_coverage_txt:
        type:
        outputSource: calculate_capture_coverage/library_coverage_txt
        doc: 
    read_coverage_summary:
        type:
        outputSource: calculate_read_depth/read_coverage_summary
        doc: 
    insert_size_metrics_txt:
        type:
        outputSource: insert_size_metrics/insert_size_metrics_txt
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    convert_bam_to_bed:
        run: ../tools/bam_quality.cwl
        label:
        label_metadata:
        in:
            bam: [recalibrated_bam]
        out:
            [recalibrated_bed]
    create_target_exome_bed:
        run: ../tools/bam_quality.cwl
        label: "bedtools-intersect"
        label_metadata:
        in:
            bed: [target_sites]
            bed: [library_sites] ## sites targeted by the library
        out:
            [intersect_bed]
    calculate_coverage_stats:
        run: ../tools/bam_quality.cwl
        label: "bedtools-coverageBed version xx"
        label_metadata: https://bio.tools/tool/BEDTools/version/none
        in:
            bed: convert_bam_to_bed/recalibrated_bed
            bed: [target_sites] ## bed file over the target sites -- this may be redunandant if list of genes not provided.
            bed: [intersect_bed] ## bed file over the exome intersect library sites
            bed: [library_sites] ## bed file over the library
            bam: recalibrated_bam
        out:
            [exome_coverage_gz, ontarget_txt]
    calculate_qc_statistics:
        run: ../tools/bam_quality.cwl
        label: "samtools version xx"
        label_metadata: https://bio.tools/tool/BEDTools/version/none
        in:
            bed: [recalibrated_bam]
        out:
            [fragments_tsv]
    gender_check:
        run: ../tools/bam_quality.cwl
        label: "check_karyotype.py updated XX"
        label_metadata:
        in:
            vcf: calculate_exome_coverage/exome_coverage_gz
        out:
            [karyotype_summary]
    calculate_capture_coverage:
        run: ../tools/bam_quality.cwl
        label: "calculate_exon_coverage.py version xx"
        label_metadata:
        in:
            exome_coverage: calculate_exome_coverage/report_summary_gz
            bed: [library_sites]
        out:
            [library_coverage_txt]
    calculate_read_depth:
        run: ../tools/bam_quality.cwl
        label: "gatk-depthOfCoverage version xx"
        label_metadata: https://bio.tools/tool/gatk2_depth_of_coverage-/version/none
        in:
            bam: [recalibrated_bam]
        out:
            [read_coverage_summary]
    insert_size_metrics:
        run: ../tools/bam_quality.cwl
        label: "picard-collectInsertSizeMetrics version xx"
        label_metadata:
        in:
            bam: [recalibrated_bam]
        out:
            [insert_size_metrics_txt]
    stage_report:
        run: ../tools/bam_quality.cwl
        label: "qc_report.py version xx"
        label_metadata:
        in:
            gender: gender_check/karyotype_summary
            exome_coverage: calculate_exome_coverage/exome_coverage_gz
            ontarget_coverage: calculate_exome_coverage/ontarget_txt
            library_coverage: calculate_capture_coverage/library_coverage_txt
            read_coverage: calculate_read_depth/read_coverage_summary
            fragments_tsv: calculate_qc_statistics/fragments_tsv
        out:
            [stage_report_pdf]
            
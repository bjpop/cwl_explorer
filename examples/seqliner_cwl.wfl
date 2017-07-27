
cwlVersion: v1.0
class: Workflow
label: "Detect Variants workflow"
doc: WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe.
requirements:
    - class: SubworkflowFeatureRequirement
inputs:
    forward_fastq_t:
        type: File
        format: edam:format_1930  # fastq
        doc:
    reverse_fastq_t:
        type: File
        format: edam:format_1930  # fastq
        doc:
    forward_fastq_n:
        type: File
        format: edam:format_1930  # fastq
        doc:
    reverse_fastq_n:
        type: File
        format: edam:format_1930  # fastq
        doc:
    annotations_snps:
        type: File
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
    chr_coords:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates for a chromosome.
outputs:
    fastqc_report_forward_t:
        type: File
        outputSource: read_quality_t/forward_t_report_html
        doc:
    fastqc_report_reverse_t:
        type: File
        outputSource: read_quality_t/reverse_t_report_html
        doc:
    fastqc_report_forward_n:
        type: File
        outputSource: read_quality_n/forward_n_report_html
        doc:
    fastqc_report_reverse_n:
        type: File
        outputSource: read_quality_n/reverse_n_report_html
        doc:
    dedup_metrics_t:
        type: File
        outputSource: mark_duplicates_t/dedup_metrics_t
        doc:
    dedup_metrics_n:
        type: File
        outputSource: mark_duplicates_n/dedup_metrics_n
        doc:
    pathos:
        type: File
        outputSource: export_to_Pathos_pipeline/pathos
steps:
    read_quality_t:
        run: fastqc.cwl
        label: "fastQC version 0.11.5"  ## this would normally be extracted from tools class
        label_metadata: https://bio.tools/tool/BWA/version/none ## my own addition. This would normally be included in tools class
        doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.
        in:
            forward_reads: forward_fastq_t
            reverse_reads: reverse_fastq_t
        out:
            [forward_t_report_html, reverse_t_report_html]
    check_adaptors_t:
        run: adaptors.cwl
        label: "cutadapt version 1.5"
        doc: adaptor contamination removed from the bam file. A list of adaptors is extracted from the fastQC output. This step is performed irrespective of the presence of contamination. In the case of no contamination, no overrepresented sequences will be present in the fastqc report.
        in:
            forward_reads: forward_t_fastq
            reverse_reads: reverse_t_fastq
            fastqc_adaptors_forward: fastqc_forward_t_html
            fastqc_adaptors_reverse: fastqc_reverse_t_html
        out:
            clean_fastq_forward: [clean_forward_t_fastq]
            clean_fastq_reverse: [clean_reverse_t_fastq]
   align_to_reference_t:
        run: align.cwl
        label: "bwa-mem version 0.7.13"
        label_metadata: https://bio.tools/tool/BWA/version/none
        doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.
        in:
            forward_reads: forward_t_fastq
            reverse_reads: reverse_t_fastq
            reference: [reference_assembly]
        out:
            [ref_aligned_t_bam]
    merge_alignments_t:
        run: merge_alignments.cwl
        label: "picard-mergSamFiles version 2.6.0"
        doc: merge individual alignments representing sequencing lanes.
        in:
            bam: [align_to_ref_t/ref_aligned_t_bam]
        out:
            [merged_t_bam]
    genomic_coord_sort_t:
        run: coord_sort.cwl
        label: "samtools version 1.3"
        label_metadata: https://bio.tools/tool/SAMtools/version/none
        in:
            bam: merge_alignments_t/merged_t_bam
        out:
            [sorted_t_bam]
    mark_duplicates_t:
        run: mark_duplicates.cwl
        label: "picard-markDuplicates"
        label_metadata:
        doc: identify pcr duplicates and mark.
        in:
            bam: genomic_coord_sort_t/sorted_t_bam
        out:
            [deduped_t_bam, dedup_t_metrics]
    performance_report_t:
        run: performance_report_t.cwl
        label: "samtools-view version, performance_summary.pl"
        doc:
        in:
            bam: mark_duplicates_t/deduped_t_bam
        out:
            [performance_report_t_csv]
    calculate_gene_coverage_t:
        run: gene_coverage.cwl
        label: "geneCoverage.py"
        label_metadata: 
        in:
            bam: mark_duplicates_t/deduped_t_bam
        out:
            [gene_coverage_t_txt]
    calculate_read_depth_t:
        run: read_depth.cwl
        label: "gatk-depthOfCoverage version xx"
        label_metadata: https://bio.tools/tool/gatk2_depth_of_coverage-/version/none
        in:
            bam: mark_duplicates_t/deduped_t_bam
        out:
            [read_coverage_t_summary]
    read_quality_n:
        run: fastqc.cwl
        label: "fastQC version 0.11.5"  ## this would normally be extracted from tools class
        label_metadata: https://bio.tools/tool/BWA/version/none ## my own addition. This would normally be included in tools class
        doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.
        in:
            forward_reads: forward_fastq_n
            reverse_reads: reverse_fastq_n
        out:
            [forward_n_report_html, reverse_n_report_html]
    check_adaptors_n:
        run: adaptors.cwl
        label: "cutadapt version 1.5"
        doc: adaptor contamination removed from the bam file. A list of adaptors is extracted from the fastQC output. This step is performed irrespective of the presence of contamination. In the case of no contamination, no overrepresented sequences will be present in the fastqc report.
        in:
            forward_reads: forward_n_fastq
            reverse_reads: reverse_n_fastq
            fastqc_adaptors_forward: fastqc_forward_n_html
            fastqc_adaptors_reverse: fastqc_reverse_n_html
        out:
            clean_fastq_forward: [clean_forward_n_fastq]
            clean_fastq_reverse: [clean_reverse_n_fastq]
    align_to_reference_n:
        run: align.cwl
        label: "bwa-mem version 0.7.13"
        label_metadata: https://bio.tools/tool/BWA/version/none
        doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.
        in:
            forward_reads: forward_n_fastq
            reverse_reads: reverse_n_fastq
            reference: [reference_assembly]
        out:
            [ref_aligned_bam]
    merge_alignments_n:
        run: merge_alignments.cwl
        label: "picard-mergSamFiles version 2.6.0"
        doc: merge individual alignments representing sequencing lanes.
        in:
            bam: [align_to_ref_n/ref_aligned_n_bam]
        out:
            [merged_n_bam]
    genomic_coord_sort_n:
        run: coord_sort.cwl
        label: "samtools version 1.3"
        label_metadata: https://bio.tools/tool/SAMtools/version/none
        in:
            bam: merge_alignments_n/merged_n_bam
        out:
            [sorted_n_bam]
    mark_duplicates_n:
        run: mark_duplicates.cwl
        label: "picard-markDuplicates"
        label_metadata:
        doc: identify pcr duplicates and mark.
        in:
            bam: genomic_coord_sort_n/sorted_n_bam
        out:
            [deduped_n_bam, dedup_n_metrics]
    performance_report_n:
        run: performance_report_n.cwl
        label: "samtools-view version, performance_summary.pl"
        doc:
        in:
            bam: mark_duplicates_n/deduped_n_bam
        out:
            [performance_report_n_csv]
    calculate_gene_coverage_n:
        run: gene_coverage.cwl
        label: "geneCoverage.py"
        label_metadata: 
        in:
            bam: mark_duplicates_n/deduped_n_bam
        out:
            [gene_coverage_n_txt]
    calculate_read_depth_n:
        run: read_depth.cwl
        label: "gatk-depthOfCoverage version xx"
        label_metadata: https://bio.tools/tool/gatk2_depth_of_coverage-/version/none
        in:
            bam: mark_duplicates_n/deduped_n_bam
        out:
            [read_coverage_n_summary]
    merge_tumour_normal:
        run: merge_alignments.cwl
        label: "picard-mergSamFiles version 2.6.0"
        doc: merge individual alignments representing sequencing lanes.
        in:
            bam: mark_duplicates_t/deduped_t_bam
            bam: mark_duplicates_n/deduped_n_bam
        out:
            [merged_t_n_bam]
    realign_intervals:
        run: realign_intervals.cwl
        label: "gatk-RealignerTargetCreator version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_realigner_target_c/version/none
        doc: identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.
        in:
            reference: [reference_assembly]
            bam: merge_tumour_normal/merged_t_n_bam
            known_indel_sites: [annotations_indels]
        out:
            [realigned_intervals]
    perform_realignment:
        run: perform_realignment.cwl
        label: "gatk-IndelRealigner version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_indel_realigner-IP/version/none
        doc: perform realignment and generate new vcf with updated coords.
        in:
            reference: [reference_assembly]
            bam: merge_tumour_normal/merged_t_n_bam
            known_indel_sites: [annotations_indels]
            interval_list: realign_intervals/realigned_intervals
        out:
            [merged_dedup_realigned_bam]
    bqsr:
        run: bqsr.cwl
        label: "gatk-baseRecalibrator version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_base_recalibrator-/version/none
        doc: recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).
        in:
            reference: [reference_assembly]
            bam: perform_realignment/merged_dedup_realigned_bam
            known_sites: [annotations_snps, annotations_indels]
        out:
            [recalibrated_table]
    apply_bqsr:
        run: apply_bqsr.cwl
        label: "gatk-printReads version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_print_reads-IP/version/none
        doc: overwrite quality scores with re-calibrated values.
        in:
            bam: perform_realignment/merged_dedup_realigned_bam
            bqsr_table: bqsr/recalibrated_table
        out:
            [recalibrated_t_n_bam]
    split_tumour_normal:
        run: split_tumour_normal.cwl
        label: "gatk-splitSamFile version 3.6"
        doc: split tumour and normal samples into separate bam files.
        in:
            reference: [reference_assembly]
            bam: apply_bqsr/recalibrated_t_n_bam
        out:
            [recalibrated_tumour_bam, recalibrated_normal_bam]
    call_germline_variants: ## each chromosome run on separate cores
        run: call_germline_variants.cwl
        label: "gatk-HaplotypeCaller version 3.6"
        label_metadata: https://bio.tools/tool/gatk2_haplotype_caller-I/version/none
        doc: simultaneous call of indels and snvs across target region sites. Germline called on combined tumour and normal bam. Calls are parrellised by chromosome. Chromosome regions are inferred from bed files containing chromosomal coordinates. Each chromosome is represented by a different bed file.
        in:
            reference: [reference_assembly]
            bam: apply_bqsr/normal_recalibrated_bam
            annotations_snps: annotations_snps
            bed: [target_sites]
            bed: [chr_bed]
        out:
            [raw_variants_g_vcf]
    call_somatic_variants_mutect2: ## each chromosome run on separate cores
        run: call_somatic_variants_mutect2.cwl
        label: "gatk-mutect2 version 3.6"
        label_metadata: https://bio.tools/tool/MuTect/version/none
        doc: simultaneous call of indels and snvs across target region sites. Germline called on combined tumour and normal bam.
        in:
            reference: [reference_assembly]
            bam: split_tumour_normal/recalibrated_tumour_bam
            bam: split_tumour_normal/recalibrated_normal_bam
            annotations_snps: annotations_snps
            bed: [target_sites]
            bed: [chr_bed]
        out:
            [chr_raw_variants_s_g_mutect_vcf]
    combine_mutect2_chr:
        run: combine_mutect2.cwl
        label: "gatk-catvariants"
        doc: combine variant calls for each chromosome into a single vcf
        in:
            vcf: call_somatic_variants_mutect2/chr_raw_variants_s_g_mutect_vcf
        out:
            vcf: [raw_variants_s_g_mutect_vcf]
    filter_hard_mutect2:
        run: hard_filter_mutect2.cwl
        label: "vcftools version 0.1.14"
        doc: discard low quality reads (variants failing to PASS flag)
        in:
            vcf: combine_mutect2_chr/raw_variants_s_g_mutect_vcf
        out:
            [filter_variants_s_g_mutect_vcf]
    call_somatic_variants_vardict:
        run: call_somatic_variants_vardict.cwl
        label: "vardict version XX"
        label_metadata: https://bio.tools/tool/gatk2_haplotype_caller-I/version/none
        doc: simultaneous call of indels and snvs across target region sites. Germline called on combined tumour and normal bam.
        in:
            reference: [reference_assembly]
            bam: split_tumour_normal/recalibrated_tumour_bam
            bam: split_tumour_normal/recalibrated_normal_bam
            annotations_snps: [annotations_snps]
            bed: [target_sites]
            bed: [chr_bed]
        out:
            [chr_raw_variants_s_g_vardict_vcf]
    combine_vardict_chr:
        run: combine_vardict.cwl
        label: "gatk-catvariants"
        doc: combine variant calls for each chromosome into a single vcf
        in:
            vcf: call_somatic_variants_vardict/chr_raw_variants_s_g_vardict_vcf
        out:
            [raw_variants_s_g_vardict_vcf]
    filter_vardict:
        run: filter_vardict.cwl
        label: "bcftools version 1.3.1"
        doc: discard all somatic calls except those with status "strong somatic". This is because vardict is too sensitive with its calls.
        in:
            vcf: combine_vardict_chr/raw_variants_s_vardict_vcf
        out:
            [filter_variants_s_g_vardict_vcf]
    call_somatic_variants_varscan:
        run: call_somatic_variants_varscan.cwl
        label: "varscan version XX"
        label_metadata: https://bio.tools/tool/VarScan/version/none
        doc: 
        in:
            reference: [reference_assembly]
            bam: apply_bqsr/tumour_normal_recalibrated_bam
            annotations_snps: [annotations_snps]
            bed: [target_sites]
        out:
            [raw_variants_s_g_vardict_bam]
    filter_somatic_varscan:
        run: filter_somatic_varscan.cwl
        label: ""
        doc:
        in:
            vcf: call_somatic_variants_varscan/raw_variants_s_g_vardict_bam
        out:
            [filter_variants_s_g_varscan_vcf]
    combine_somatic_variants:
        run: combine_somatic_variants.cwl
        label: "gatk-combineVariants version 3.6"
        doc: combine somatic variants generated by each of the mutation callers. Necessary to generate average for AD and DP.
        in:
            vcf: filter_somatic_varscan/filter_variants_s_g_varscan_vcf
            vcf: filter_vardict/filter_variants_s_g_vardict_vcf
            vcf: filter_hard_mutect2/filter_variants_s_g_mutect_vcf
        out:
            [somatic_variants_vcf]
    select_variants_by_region:
        run: select_variants_by_region.cwl
        label: "bedtools-intersect version 2.21"
        label_metadata: https://bio.tools/tool/BEDTools/version/none
        in:
           vcf: combine_somatic_variants/somatic_variants_vcf
           bed: [target_sites]
        out: 
             [select_somatic_variants_vcf]
    averageDPAD:
        run: average_dp_ad.cwl
        label: "vcf_getaverageDP_AD.py"
        doc: Average value for DP and AD calculated based on the values output by each of the somatic callers. Only a single value for this field is accepted by the curation platform.
        in:
           vcf: select_variants_by_region/select_somatic_variants_vcf
        out:
           [somatic_DPADaverage_vcf]
    annotate_variants_mutect2:
        run: annotate_vep_mutect2.cwl
        label: "vep version 78"
        in:
           vcf: filter_hard_mutect2/filter_variants_s_mutect_vcf
        out:
           [vep_annotated_mutect2_vcf]
    annotate_variants_varscan:
        run: annotate_vep_varscan.cwl
        label: "vep version 78"
        in:
           vcf: filter_somatic_varscan/filter_variants_s_g_varscan_vcf
        out:
           [vep_annotated_varscan_vcf]
    annotate_variants_vardict:
        run: annotate_vep_vardict.cwl
        label: "vep version 78"
        in:
           vcf: combine_vardict_chr/raw_variants_s_g_vardict_vcf
        out:
           [vep_annotated_vardict_vcf]
    calculate_additional_stats:
        run: bam_stats.cwl
        label: "bam_stats.py, samtools version XX"
        doc: calculate and add additional statistics using in-house tools. Modifies metrics produced by the variant caller with more strict quality criteria applied.
        in:
           vcf: call_germline_variants/raw_variants_g_bam
           bam: split_tumour_normal/recalibrated_normal_bam
        out:
            [additional_bam_stats]
    export_to_Pathos_pipeline:
        run: pathos_pipe.cwl
        label:
        doc: files uploaded to secondary pipeline for formatting prior to upload to Pathos curation platform.
        in:
           txt: calculate_gene_coverage_t/gene_coverage_t_txt
           txt: calculate_gene_coverage_n/gene_coverage_n_txt
           txt: annotate_variants/vep_annotated_vcf
           txt: calculate_additional_stats/additional_bam_stats
           txt: performance_report_t/performance_report_t_csv
           txt: performance_report_n/performance_report_n_csv
           txt: calculate_read_depth_t/read_coverage_t_summary
           txt: calculate_read_depth_n/read_coverage_n_summary
           vcf: annotate_variants_vardict/vep_annotated_vardict_vcf
           vcf: annotate_variants_mutect2/vep_annotated_mutect2_vcf
           vcf: annotate_variants_varscan/vep_annotated_varscan_vcf
           vcf: call_germline_variants/raw_variants_g_vcf
         out:
            [pathos]

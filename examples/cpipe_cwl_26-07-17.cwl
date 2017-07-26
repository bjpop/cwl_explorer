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
    bam:
        type: File
		format: edam:format_2572  # bam
        secondaryFiles: [^.bai]
        doc:
    vcf: 		
        type: File
		format: edam:format_3016  # vcf
        doc:
    interval_list:
        type: File
		format: edam:format_3475  # tsv
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
    table:
        type: File
        outputSource: transcript_filter/transcript_filter_table
		doc:
steps:
    read_quality:
        run: fastqc.cwl
		label: "fastQC version 0.11.5"  ## this would normally be extracted from tools class
		label_metadata: https://bio.tools/tool/BWA/version/none ## my own addition. This would normally be included in tools class
		doc: Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.
		in:
			forward_reads: forward_reads
			reverse_reads: reverse_reads
		out:
			[forward_report_html, reverse_report_html]
    align_to_ref:
        run: align.cwl
		label: "bwa-mem version 0.7.13"
		label_metadata: https://bio.tools/tool/BWA/version/none
		doc: align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.
        in:
            forward_reads: forward_reads
            reverse_reads: reverse_reads
            reference: reference_assembly
        out:
            [ref_aligned_bam]
    merge_alignments:
        run: merge_alignments.cwl
		label: "picard-mergSamFiles v2.6.0"
		doc: merge individual alignments representing sequencing lanes.
        in:
            bam: [align_to_ref/ref_aligned_bam]
        out:
            [merged_bam]
    sort_by_coords:
        run: coord_sort.cwl
		label: "samtools version 1.3"
		label_metadata: https://bio.tools/tool/SAMtools/version/none
        in:
            bam: merge_alignments/merged_bam
        out:
            [sorted_bam]
    mark_duplicates:
        run: mark_duplicates.cwl
		label: "picard-markDuplicates"
		label_metadata:
		doc: identify pcr duplicates and mark.
        in:
            bam: genomic_coord_sort/sorted_bam
        out:
            [deduped_bam]
    realign_intervals:
        run: realign_intervals.cwl
		label: "gatk-RealignerTargetCreator version 3.6"
		label_metadata: https://bio.tools/tool/gatk2_realigner_target_c/version/none
		doc: identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.
        in:
            reference: reference_assembly
            bam: mark_duplicates/deduped_bam
            known_indel_sites: [annotations_indels]
        out:
            [realigned_intervals]
    perform_realignment:
        run: perform_realignment.cwl
		label: "gatk-IndelRealigner version 3.6"
		label_metadata: https://bio.tools/tool/gatk2_indel_realigner-IP/version/none
		doc: perform realignment and generate new vcf with updated coords.
        in:
            reference: reference_assembly
            bam: mark_duplicates/deduped_bam
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
            reference: reference_assembly
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
            reference: reference_assembly
            bam: perform_realignment/merged_dedup_realigned_bam
            bqsr_table: bqsr/recalibrated_table
        out:
            [recalibrated_bam]
    call_variants:
        run: call_variants.cwl
		label: "gatk-HaplotypeCaller version 3.6"
		label_metadata: https://bio.tools/tool/gatk2_haplotype_caller-I/version/none
		doc: simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.
        in:
            reference: reference_assembly
            bam: apply_bqsr/recalibrated_bam
            annotations_snps: annotations_snps
			bed: target_regions
        out:
            [raw_variants_bam]
    genotypeGVCFs:
        run: genotypeGVCFs.cwl
		label: "gatk-genotypeGVCF version 3.6"
		label_metadata: 
		doc: genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.
        in:
            reference: reference_assembly
            annotations_snps: annotations_snps
            variant: call_variants/raw_variants_vcf
        out:
            [raw_variants_gvcf]
    select_indels:
        run: select_indels.cwl
		label: "gatk-selectVariants version 3.6"
		label_metadata:
		doc: extract indel mutations only. This is necessary so that indel-specific filters can be applied.
        in:
            reference: reference_assembly
            variant: genotypeGVCFs/raw_variants_gvcf
        out:
            [indel_vcf]
    select_snvs:
        run: select_snvs.cwl
		label: "gatk-selectVariants version 3.6"
		label_metadata:
		doc: extract all but indel mutations types so that hard filters can be applied.
        in:
            reference: reference_assembly
            variant: genotypeGVCFs/raw_variants_gvcf
        out:
            [snv_vcf]
    hard_filter_indels:
        run: indel_hardfilter.cwl
		label: "gatk-selectVariants version 3.6"
		label_metadata: 
		doc: apply hard quality filters on allelic depth etc.
        in:
            reference: reference_assembly
            variant: select_indels/indel_vcf
        out:
            [hard_filtered_indel_vcf]
    hard_filter_snvs:
        run: snv_hardfilter.cwl
		label: "gatk-selectVariants version 3.6"
		label_metadata:
		doc: apply hard quality filters on allelic depth, etc.
        in:
            reference: reference_assembly
            variant: select_snvs/snv_vcf
        out:
            [hard_filtered_snv_vcf]
    merge_variants:
        run: merge_variants.cwl
		label: "gatk-selectVariants version 3.6"
		label_metadata:
		doc: merge filtered indel and snv vcfs
        in:
            reference: reference_assembly
            indels: hard_filter_indels/hard_filtered_indel_vcf
            snvs: hard_filter_snvs/hard_filtered_snv_vcf
        out:
            [merged_variants_vcf]
    vcf_normalze:
        run: vcf_normalize.cwl
		label: "bcftools version 1.3"
		label_metadata: https://bio.tools/tool/bcftools/version/1.2
		doc: normalisation and split multi-allelic sites
        in:
            reference: reference_assembly
            variant: merge_variants/merged_variants_vcf
        out:
            [normalized_vcf]
    vcf_annotate:
        run: vcf_annotate.cwl
		label: "vep version 85"
		label_format: https://bio.tools/tool/VEP/version/none%7CVEP
		doc: 
        in:
            variant: vcf_normalize/normalized_vcf
        out:
            [annotated_vcf]
    vcf_annotate_2:
        run: vcf_annotate.cwl
		label: "grantham, condel plugin"
		label_metadata:
		doc: additional variant effect prediction scores
        in:
            variant: vcf_annotate/annotated_vcf
        out:
            [annotated_2_vcf]
    post_annotate_vep:
        run: post_annotate_vep.cwl
		label: "dbNSFP version 2.9.1"
		label_metadata:
		doc: discard variants outside of non-coding regions
        in:
            variant: vcf_annotate_2/annotated_2_vcf
        out:
            [vep_annotated_vcf]
    vcf_to_table:
        run: vcf_to_table.cwl
		label: "vcf_to_table.py"
		label_metadata:
        in:
            reference: reference_assembly
            variant: post_annotate_vep/vep_annotated_vcf
        out:
            [variant_table_tsv]
    filter_table_forLOVD:
        run: filter_table.cwl
		label: "filter.py"
		label_metadata:
        in:
            table: vcf_to_table/variant_table
        out:
            [filtered_variant_table]
    lovd_table:
        run: lovd_table.cwl
		label: "filter_lovd.py"
		label_metadata:
        in:
            variant: filter_table_forLOVD/filtered_variant_table
        out:
            [lovd_compatible_table]
    transcript_filter:
        run: transcript_table.cwl
		label: "filter.py updated XX"
		label_metadata:
        in:
            table: lovd_table/lovd_compatible_table
        out:
            [transcript_filtered_table]
    gender_check:
        run: karyotype.cwl
		label: "check_karyotype.py updated XX"
		label_metadata:
        in:
            vcf: calculate_exome_coverage/exome_coverage
        out:
            [karyotype_summary]
    calculate_exome_coverage:
        run: exome_coverage.cwl
		label: "bedtools version xx"
		label_metadata: https://bio.tools/tool/BEDTools/version/none
        in:
            bam: apply_bqsr/recalibrated_bam
 			bed: target_sites
       out:
            [exome_coverage_gz]
    calculate_capture_coverage:
        run: capture_coverage.cwl
		label: "calculate_exon_coverage.py version xx"
		label_metadata:
        in:
            exome_coverage: calculate_exome_coverage/report_summary_gz
			bed: ucsc_exon_sites
        out:
            [library_coverage_txt]
	calculate_read_depth:
        run: read_depth.cwl
		label: "gatk-depthOfCoverage version xx"
		label_metadata: https://bio.tools/tool/gatk2_depth_of_coverage-/version/none
        in:
            bam: apply_bqsr/recalibrated_bam
        out:
            [read_coverage_summary]
    insert_size_metrics:
        run: insert_size_metrics.cwl
		label: "picard-collectInsertSizeMetrics version xx"
		label_metadata:
        in:
            bam: apply_bqsr/recalibrated_bam
        out:
            [insert_size_metrics_txt]
    stage_report:
        run: qc_report.cwl
		label: "qc_report.py version xx"
		label_metadata:
        in:
            gender: gender_check/karyotype_summary
			exome_coverage: exome_coverage_gz
			library_coverage: calculate_capture_coverage/library_coverage_txt
			read_coverage: calculate_read_depth/read_coverage_summary
        out:
            [stage_report_pdf]
	variant_curation:
	    run: lovd.cwl
		label: "lovd+ version xx"
		label_metadata:
        in:
			table: filter_table_forLOVD/lovd_compatible_table
            gender: gender_check/karyotype_summary
			read_coverage: calculate_read_depth/read_coverage_summary
			library_coverage: calculate_capture_coverage/library_coverage_txt
			insert_size_metrics: insert_size_metrics/insert_size_metrics_txt
			stage_report: stage_report/stage_report_pdf
        out:
            [lovd+_report]
	
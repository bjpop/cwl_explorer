cwlVersion: v1.0
class: Workflow
label: "post_alignment_processing"
doc:

inputs:
    aligned_merged_bam:
        type: File
        format:
        doc:
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing coordinates for intersection of exons and library captures sites.
    known_snp_sites:
        type: File
        format: data_1106 # dbSNP ID
        secondaryFiles: [.tbi]
        doc:
    known_indel_sites:
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
        type: File
        outputSource: apply_recalibration/recalibrated_bam
        doc: 
    dedup_metrics:
        type: File
        outputSource: mark_duplicates/dedup_metrics
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    genomic_coord_sort:
        run: genomic_coord_sort.cwl
        label: "samtools version 1.3"
        in:
            bam: [aligned_merged_bam]
        out:
            [sorted_bam]
    mark_duplicates:
        run: mark_duplicates.cwl
        label: "picard-markDuplicates"
        doc: identify pcr duplicates and mark.
        in:
            sorted_aligned_bam: genomic_coord_sort/sorted_bam
        out: 
            [deduped_bam, dedup_metrics]
    realign_intervals:
        run: realign_intervals.cwl
        label: "gatk-RealignerTargetCreator version 3.6"
        doc: identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.
        in:
            reference_assembly: [reference_assembly]
            deduped_bam: mark_duplicates/deduped_bam
            known_indel_sites: [known_indel_sites]
            target_sites: [target_sites]
        out:
            [realigned_intervals]
    perform_realignment:
        run: perform_realignment.cwl
        label: "gatk-IndelRealigner version 3.6"
        doc: perform realignment and generate new vcf with updated coords.
        in:
            reference_assembly: [reference_assembly]
            deduped_bam: mark_duplicates/deduped_bam
            interval_list: realign_intervals/realigned_intervals
        out:
            [deduped_realigned_bam]
    base_quality_recalibration:
        run: bqsr.cwl
        label: "gatk-baseRecalibrator version 3.6"
        doc: recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).
        in:
            reference_assembly: [reference_assembly]
            deduped_realigned_bam: perform_realignment/deduped_realigned_bam
            known_snp_sites: [known_snp_sites]
            target_sites: [target_sites]
        out:
            [recalibrated_table]
    apply_recalibration:
        run: apply_bqsr.cwl
        label: "gatk-printReads version 3.6"
        doc: overwrite quality scores with re-calibrated values.
        in:
            reference_assembly: [reference_assembly]
            deduped_realigned_bam: perform_realignment/deduped_realigned_bam
            recalibrated_table: base_quality_recalibration/recalibrated_table
            target_sites: [target_sites]
        out:
            [recalibrated_bam]

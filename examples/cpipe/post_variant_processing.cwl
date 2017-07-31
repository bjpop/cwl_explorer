cwlVersion: v1.0
class: Workflow
label: "post_variant_processing"
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
        run: select_indels.cwl
        label: "gatk-selectVariants version 3.6"
        doc: extract indel mutations only. This is necessary so that indel-specific filters can be applied.
        in:
            reference: [reference_assembly]
            variant: [raw_variants_gvcf]
        out:
            [indel_vcf]
    select_snvs:
        run: select_snvs.cwl
        label: "gatk-selectVariants version 3.6"
        doc: extract all but indel mutations types so that hard filters can be applied.
        in:
            reference: [reference_assembly]
            variant: [raw_variants_gvcf]
        out:
            [snv_vcf]
    hard_filter_indels:
        run: indel_hardfilter.cwl
        label: "gatk-selectVariants version 3.6"
        doc: apply hard quality filters on allelic depth etc.
        in:
            reference: [reference_assembly]
            variant: select_indels/indel_vcf
        out:
            [hard_filtered_indel_vcf]
    hard_filter_snvs:
        run: snv_hardfilter.cwl
        label: "gatk-selectVariants version 3.6"
        doc: apply hard quality filters on allelic depth, etc.
        in:
            reference: [reference_assembly]
            variant: select_snvs/snv_vcf
        out:
            [hard_filtered_snv_vcf]
    merge_variants:
        run: merge_variants.cwl
        label: "gatk-selectVariants version 3.6"
        doc: merge filtered indel and snv vcfs
        in:
            reference: [reference_assembly]
            indels: hard_filter_indels/hard_filtered_indel_vcf
            snvs: hard_filter_snvs/hard_filtered_snv_vcf
        out:
            [merged_variants_vcf]
    vcf_normalize:
        run: vcf_normalize.cwl
        label: "bcftools version 1.3"
        doc: normalisation and split multi-allelic sites
        in:
            reference: [reference_assembly]
            variant: merge_variants/merged_variants_vcf
        out:
            [normalized_vcf]

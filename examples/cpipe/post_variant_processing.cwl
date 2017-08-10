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
    raw_variants_g_gvcf:
        type: File
        format:
        doc: 
outputs:
    normalized_g_vcf:
        type: File
        outputSource: vcf_normalize/normalized_g_vcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    select_indels:
        run: select_indels.cwl
        label: "gatk-selectVariants version 3.6"
        doc: extract indel mutations only. This is necessary so that indel-specific filters can be applied.
        in:
            reference_assembly: [reference_assembly]
            raw_variants_g_gvcf: [raw_variants_g_gvcf]
        out:
            [indel_g_gvcf]
    select_snvs:
        run: select_snvs.cwl
        label: "gatk-selectVariants version 3.6"
        doc: extract all but indel mutations types so that hard filters can be applied.
        in:
            reference_assembly: [reference_assembly]
            raw_variants_g_gvcf: [raw_variants_g_gvcf]
        out:
            [snv_g_gvcf]
    merge_variants:
        run: merge_variants.cwl
        label: "gatk-selectVariants version 3.6"
        doc: merge filtered indel and snv vcfs
        in:
            reference_assembly: [reference_assembly]
            indel_g_gvcf: select_indels/indel_g_gvcf
            snv_g_gvcf: select_snvs/snv_g_gvcf
        out:
            [merged_variants_vcf]
    vcf_normalize:
        run: vcf_normalize.cwl
        label: "bcftools version 1.3"
        doc: normalisation and split multi-allelic sites
        in:
            reference_assembly: [reference_assembly]
            merged_variants_vcf: merge_variants/merged_variants_vcf
        out:
            [normalized_g_vcf]

cwlVersion: v1.0
class: Workflow
label: "variant_calling"
doc: This is some documentation

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
        doc: "bed file containing coordinates for intersection of exons and library captures sites."
    recalibrated_bam:
        type: File
outputs:
    raw_variants_gvcf:
        type: File
        outputSource: genotypeGVCFs/raw_variants_gvcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    call_variants:
        run: call_variants.cwl
        label: "gatk-HaplotypeCaller version 3.6"
        doc: simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.
        in:
            reference: [reference_assembly]
            bam: [recalibrated_bam]
            known_indels: [annotations_indels]
            known_snps: [annotations_snps]
            bed: [target_sites]
        out:
            [raw_variants_vcf]
    genotypeGVCFs:
        run: genotypeGVCFs.cwl
        label: "gatk-genotypeGVCF version 3.6"
        doc: genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.
        in:
            reference: [reference_assembly]
            known_indels: [annotations_indels_2]
            variant: call_variants/raw_variants_vcf
        out:
            [raw_variants_gvcf]

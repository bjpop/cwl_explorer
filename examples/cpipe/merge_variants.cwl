cwlVersion: v1.0
class: CommandLineTool

label: "merge variants"

doc: |


hints:
  SoftwareRequirement:
    packages:
        gatk-toolkit:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "3.6" ]

inputs:
    indel_g_gvcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:
    snv_g_gvcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:

    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]

outputs:
    merged_variants_vcf:
        type: File
        format: http://edamontology.org/format_3016
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "CombineVariants"]

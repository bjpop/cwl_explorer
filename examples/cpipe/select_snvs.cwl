cwlVersion: v1.0
class: CommandLineTool

label: "select variants - snvs"

doc: |


hints:
  SoftwareRequirement:
    packages:
        gatk-toolkit:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "3.6" ]

inputs:
    raw_variants_g_gvcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:

    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]

    SELECTTYPETOINCLUDE:
        type: string
        doc: "[SNP, MIXED, MNP, SYMBOLIC, NO VARIATION]"
        inputBinding:
            position:
            prefix: '--selectTypeToInclude'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    INTERVAL_PADDING:
        type: string
        doc: "[10]"
        inputBinding:
            position:
            prefix: '--interval_padding'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
outputs:
    snv_g_gvcf:
        type: File
        format:
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "SelectVariants"]

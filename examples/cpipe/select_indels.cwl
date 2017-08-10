cwlVersion: v1.0
class: CommandLineTool

label: "select variants - indel"

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
        format: http://edamontology.org/format_3016# vcf
        doc:

    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]

    SELECTTYPETOINCLUDE:
        type: string
        doc: "[INDEL]"
        inputBinding:
            prefix: '--selectTypeToInclude'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    INTERVAL_PADDING:
        type: string
        doc: "[25]"
        inputBinding:
            prefix: '--interval_padding'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    indel_g_gvcf:
        type: File
        format:
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "SelectVariants"]

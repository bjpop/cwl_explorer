cwlVersion: v1.0
class: CommandLineTool
label: "genotype GVCF"

doc: |

hints:
  SoftwareRequirement:
      packages:
          gatk-toolkit:
              specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
              version: [ "3.6" ]

inputs:
    raw_variants_g:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:
    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
    known_snp_sites:
        type: File
        format: http://edamontology.org/format_3016
        doc: "dbsnp sites"
        inputBinding:
            prefix: '--dbsnp'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    STAND_CALL_CONF:
        type: string
        doc: "[5.0]"
        inputBinding:
            prefix: '--stand_call_conf'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    STAND_EMIT_CONF:
        type: string
        doc: "[5.0]"
        inputBinding:
            prefix: '--stand_emit_conf'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
outputs:
    raw_variants_g_gvcf:
        type: File
        format: http://edamontology.org/format_3016
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "GenotypeGVCFs"]

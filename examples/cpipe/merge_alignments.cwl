cwlVersion: v1.0
class: CommandLineTool

label: "merge bam files"

doc: |
  http://bio-bwa.sourceforge.net/bwa.shtml


hints:
  SoftwareRequirement:
    packages:
        picard--mergeSamFiles:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_006525" ]
            version: [ "2.6.0" ]

inputs:
    bam:
        type: File
        format:
        doc: Merge of bam files if multiple bams due to an individual being sequenced over several lanes.

    VALIDATION_STRINGENCY: ## parameter implemented by Cpipe - string command to append to the base command
        type: string
        doc: "Description of purpose. string [LENIENT]"
        ## description of the commands purpose and the parameter applied
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    ASSUME_SORTED:
        type: string
        doc: "Description of purpose. boolean [true]"
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    CREATE_INDEX:
        type: string
        doc: "Description of purpose. boolean [true]"
        default: "" # CWL needs a value, we set it to empty default. Maybe fix


outputs:
    aligned_merged_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc: Merged and sorted bam file.

baseCommand: ["picard.jar", "MergeSamFiles"] ## core base command

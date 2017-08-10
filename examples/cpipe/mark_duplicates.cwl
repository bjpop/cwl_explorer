cwlVersion: v1.0
class: CommandLineTool
label: "identify and mark pcr duplicates."

doc: |
  http://picard.sourceforge.net
hints:
  SoftwareRequirement:
    packages:
        picard--markduplicates:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_006525" ]
            version: [ "2.6.0" ]
inputs:
    sorted_aligned_bam:
        type: File
        format:
        doc:

    VALIDATION_STRINGENCY: ## parameter implemented by Cpipe - string command to append to the base command
        type: string
        doc: "Description of purpose. string [LENIENT]"
        ## description of the commands purpose and the parameter applied
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    REMOVE_DUPLICATES:
        type: string
        doc: "Description of purpose. boolean [true]"
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    CREATE_INDEX:
        type: string
        doc: "Description of purpose. boolean [true]"
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    deduped_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc: Deduped, merged and sorted bam file.
    dedup_metrics:
        type: File
        format: http://edamontology.org/format_3475
        doc: Text file containing summaries of duplicate metrics.

baseCommand: ["picard.jar", "Markduplicates"]

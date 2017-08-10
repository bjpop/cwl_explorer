cwlVersion: v1.0
class: CommandLineTool
label: "sort bam files. Genomic coordinates is set as the default"

doc: |
  http://www.htslib.org/doc/samtools.html

hints:
  SoftwareRequirement:
    packages:
        samtools:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_002105" ]
            version: [ "1.3" ]

inputs:
    bam:
        type: File
        format: http://edamontology.org/format_2572
        doc: bam files. May be multiple bams if individual sequenced over numerous lanes.

    SORT_BY_READ_NAMES:
        type: string
        doc: "Description of purpose. string. [NULL]"
        inputBinding:
            prefix: '-n'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    sorted_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc: sorted and aligned bam file.

baseCommand: ["samtools", "sort"]

cwlVersion: v1.0
class: CommandLineTool
label: "mapping of forward and reverse reads to the reference assembly"
doc: http://bio-bwa.sourceforge.net/bwa.shtml

hints:
  SoftwareRequirement:
    packages:
      bwa-mem:
        specs: ["https://identifiers.org/rrid/RRID:SCR_010910"]
        version: ["0.7.13"]
inputs:
    forward_reads:
        type: File
        format: http://edamontology.org/format_1930 ## fastQ
        doc: 'Forward reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes'
    reverse_reads:
        type: File
        format: http://edamontology.org/format_1930 ## fastQ
        doc: 'Reverse reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes'
    reference_assembly:
        type: File
        format: http://edamontology.org/data_2340
        doc: "hg19 human reference genome"
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
    decoy_ref:
        type: string
        doc: "Decoy reference genome ['NULL']."
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

    REFERENCE: # parameter
        type: string
        doc: "Reference library file name ['ucsc.hg19.fasta']."
        inputBinding:
            prefix: '-R' # command line reference
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    MINIMUM_SEED_LENGTH: # parameter
        type: string
        doc: "Minimum seed length. INT. [19]"
        inputBinding:
            prefix: '-k'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
outputs:
    ref_aligned_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc: bam file containing aligned sequences.

baseCommand: ["bwa", "mem"]

"use strict";
 const input_workflow =
{
    "cwlVersion": "v1.0", 
    "$graph": [
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "bwa", 
                "mem"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_1930", 
                    "id": "#align.cwl/forward_reads.gz", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }, 
                    "doc": "Forward reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes"
                }, 
                {
                    "format": "http://edamontology.org/data_2340", 
                    "id": "#align.cwl/reference_assembly.fasta", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }, 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_1930", 
                    "id": "#align.cwl/reverse_reads.gz", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }, 
                    "doc": "Reverse reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes"
                }
            ], 
            "outputs": [
                {
                    "id": "#align.cwl/ref_aligned_bam", 
                    "doc": "bam file containing aligned sequences.", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_2572"
                }
            ], 
            "doc": "http://bio-bwa.sourceforge.net/bwa.shtml", 
            "label": "mapping of forward and reverse reads to the reference assembly", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "-k", 
                    "valueFrom": "19"
                }, 
                {
                    "position": 0, 
                    "prefix": "-M"
                }, 
                {
                    "position": 0, 
                    "prefix": "-t", 
                    "valueFrom": "8"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_010910"
                            ], 
                            "version": [
                                "0.7.13"
                            ], 
                            "package": "bwa-mem"
                        }
                    ]
                }
            ], 
            "id": "#align.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-", 
                "T", 
                "PrintReads"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_2572", 
                    "id": "#apply_bqsr.cwl/deduped_realigned_bam", 
                    "type": "File"
                }, 
                {
                    "format": "http://edamontology.org/format_3475", 
                    "id": "#apply_bqsr.cwl/recalibrated_table", 
                    "type": "File", 
                    "doc": "Coordinates for regions discovered requiring realignment."
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#apply_bqsr.cwl/reference_assembly", 
                    "type": "File", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "edam:format_3003", 
                    "id": "#apply_bqsr.cwl/target_sites", 
                    "type": "File", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted."
                }
            ], 
            "outputs": [
                {
                    "id": "#apply_bqsr.cwl/recalibrated_bam", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_2572"
                }
            ], 
            "label": "Apply recalibration to bam file. Overwrites values", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "-bqsr"
                }, 
                {
                    "position": 0, 
                    "prefix": "--Printreads"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#apply_bqsr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#bedtools-bamtobed.cwl", 
            "baseCommand": [], 
            "inputs": [
                {
                    "id": "#bedtools-bamtobed.cwl/recalibrated.bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#bedtools-bamtobed.cwl/bed", 
                    "type": "File"
                }
            ], 
            "label": "bedtools-bamtobed"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#bedtools-intersect.cwl", 
            "baseCommand": [
                "bedtools", 
                "intersect", 
                "|", 
                "sort"
            ], 
            "inputs": [
                {
                    "id": "#bedtools-intersect.cwl/bed_a", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#bedtools-intersect.cwl/bed_b", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#bedtools-intersect.cwl/intersect_bed", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "bedtools-intersect"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "BaseRecalibrator"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_2572", 
                    "id": "#bsqr.cwl/deduped_realigned_bam", 
                    "type": "File", 
                    "secondaryFiles": [
                        "bam.ai"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_XXXX", 
                    "id": "#bsqr.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_3003", 
                    "id": "#bsqr.cwl/target_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/target_sites"
                    }, 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted."
                }, 
                {
                    "id": "#bsqr.cwl/dbsnp_ID", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#bsqr.cwl/recalibrated_table", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "doc": "https://bio.tools/tool/gatk2_base_recalibrator-/version/none\n", 
            "label": "Calculate recalibration values for base recalibration.", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "interval_padding", 
                    "separate": false, 
                    "valueFrom": "=25"
                }, 
                {
                    "position": 0, 
                    "prefix": "known_sites", 
                    "separate": false, 
                    "valueFrom": "=dbsnp_138"
                }, 
                {
                    "position": 0, 
                    "prefix": "cov", 
                    "valueFrom": "=ReadGroupCovariate"
                }, 
                {
                    "position": 0, 
                    "prefix": "cov", 
                    "valueFrom": "=QualityScoreCovariate"
                }, 
                {
                    "position": 0, 
                    "prefix": "cov", 
                    "valueFrom": "=CycleCovariate"
                }, 
                {
                    "position": 0, 
                    "prefix": "cov", 
                    "valueFrom": "=ContextCovariate"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#bsqr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "HaplotypeCaller"
            ], 
            "inputs": [
                {
                    "format": null, 
                    "id": "#call_variants.cwl/known_snp_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "--dbsnp", 
                        "valueFrom": "/ref/known_snp_sites"
                    }, 
                    "doc": "dbsnp reference sites"
                }, 
                {
                    "format": "http://edamontology.org/format_2572", 
                    "id": "#call_variants.cwl/recalibrated_bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/recalibrated_bam"
                    }, 
                    "secondaryFiles": [
                        "bam.ai"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_XXXX", 
                    "id": "#call_variants.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_3003", 
                    "id": "#call_variants.cwl/target_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/target_sites"
                    }, 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted."
                }
            ], 
            "outputs": [
                {
                    "id": "#call_variants.cwl/raw_variants_vcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "secondaryFiles": [
                        "vcf.index"
                    ], 
                    "format": "http://edamontology.org/format_3016"
                }
            ], 
            "label": "Call variants", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "interval_padding", 
                    "valueFrom": "=25"
                }, 
                {
                    "position": 0, 
                    "prefix": "emitRefConfidence", 
                    "valueFrom": "=GVCF"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#call_variants.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#collect_insertsize_metrics.cwl", 
            "baseCommand": [
                "java", 
                "picard.jarCollectInsertSizeMetrics"
            ], 
            "inputs": [
                {
                    "id": "#collect_insertsize_metrics.cwl/recal.bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#collect_insertsize_metrics.cwl/insert_size_metrics.txt", 
                    "type": "File", 
                    "outputBinding": {}
                }, 
                {
                    "id": "#collect_insertsize_metrics.cwl/insert_size_metrics.pdf", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "collect_insertsize_metrics"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "python", 
                "convert_to_lovd.py"
            ], 
            "inputs": [
                {
                    "format": null, 
                    "id": "#convert_table_lovd.cwl/filtered_variant_table", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#convert_table_lovd.cwl/flattened_table", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "label": "convert_table_lovd - for LOVD", 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "convert_to_lovd.py"
                        }
                    ]
                }
            ], 
            "id": "#convert_table_lovd.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#coveragebed.cwl", 
            "baseCommand": [
                "bedtools", 
                "intersect"
            ], 
            "inputs": [
                {
                    "id": "#coveragebed.cwl/intersect.bed", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#coveragebed.cwl/sorted", 
                    "type": [
                        "null", 
                        "string"
                    ], 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "-"
                    }
                }, 
                {
                    "id": "#coveragebed.cwl/recal.bed", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#coveragebed.cwl/gzip.gz", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "coverageBed"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#depth_of_coverage.cwl", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "DepthOfCoverage"
            ], 
            "inputs": [
                {
                    "id": "#depth_of_coverage.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }
                }, 
                {
                    "id": "#depth_of_coverage.cwl/recal.bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/recal.bam"
                    }
                }, 
                {
                    "id": "#depth_of_coverage.cwl/target_sites.bed", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#depth_of_coverage.cwl/coverage", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "depth_of_coverage", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "-ct", 
                    "valueFrom": "1"
                }, 
                {
                    "position": 0, 
                    "prefix": "-ct", 
                    "valueFrom": "10"
                }, 
                {
                    "position": 0, 
                    "prefix": "-ct", 
                    "valueFrom": "20"
                }, 
                {
                    "position": 0, 
                    "prefix": "-ct", 
                    "valueFrom": "50"
                }, 
                {
                    "position": 0, 
                    "prefix": "-ct", 
                    "valueFrom": "100"
                }, 
                {
                    "position": 0, 
                    "prefix": "--omitDepthOutputAtEachBase"
                }
            ]
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#fastq-qc.cwl", 
            "baseCommand": [
                "fastqqc"
            ], 
            "inputs": [
                {
                    "id": "#fastq-qc.cwl/forward_reads", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#fastq-qc.cwl/reverse_reads", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#fastq-qc.cwl/fastqc_report_forward", 
                    "type": "File"
                }, 
                {
                    "id": "#fastq-qc.cwl/fastqc_report_reverse", 
                    "type": "File"
                }, 
                {
                    "id": "#fastq-qc.cwl/read1.fastqc.gz", 
                    "type": "File"
                }, 
                {
                    "id": "#fastq-qc.cwl/read2.fastqc.gz", 
                    "type": [
                        "null", 
                        "File"
                    ]
                }
            ]
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "python", 
                "filter_tsv.py"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3475", 
                    "id": "#filter_table.cwl/variant_table_tsv", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#filter_table.cwl/filtered_variant_table", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "label": "filter_table - based on quality scores", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "--ad", 
                    "valueFrom": "2"
                }, 
                {
                    "position": 0, 
                    "prefix": "--af", 
                    "valueFrom": "0.15"
                }, 
                {
                    "position": 0, 
                    "prefix": "--dp", 
                    "valueFrom": "5"
                }, 
                {
                    "position": 0, 
                    "prefix": "--qual", 
                    "valueFrom": "5"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "vcf_to_table.sh"
                        }
                    ]
                }
            ], 
            "id": "#filter_table.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#fragment_qc_stats.cwl", 
            "baseCommand": [
                "samtools", 
                "view", 
                "file.bam", 
                "|", 
                "python", 
                "calculate_qc_statistics.py"
            ], 
            "inputs": [
                {
                    "id": "#fragment_qc_stats.cwl/sam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#fragment_qc_stats.cwl/fragments.tsv", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "fragment_qc_stats"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#generate_summary_report.cwl", 
            "baseCommand": [
                "python", 
                "markdown2.py", 
                "|", 
                "python", 
                "prettify_markdown.py"
            ], 
            "inputs": [
                {
                    "id": "#generate_summary_report.cwl/report_cov", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#generate_summary_report.cwl/exome_cov", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#generate_summary_report.cwl/metrics", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#generate_summary_report.cwl/gene_cov", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#generate_summary_report.cwl/fragments", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#generate_summary_report.cwl/karyotype", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#generate_summary_report.cwl/summary.md", 
                    "type": "File", 
                    "outputBinding": {}
                }, 
                {
                    "id": "#generate_summary_report.cwl/summary.htm", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "generate_summary_report"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "GenotypeGVCFs"
            ], 
            "inputs": [
                {
                    "default": "", 
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#genotypeGVCFs.cwl/known_snp_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "--dbsnp", 
                        "valueFrom": "/ref/known_snp_sites"
                    }, 
                    "doc": "dbsnp sites"
                }, 
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#genotypeGVCFs.cwl/raw_variants_g", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/vcf/raw_variants_g"
                    }, 
                    "secondaryFiles": [
                        "vcf.index"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#genotypeGVCFs.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#genotypeGVCFs.cwl/raw_variants_g_gvcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_3016"
                }
            ], 
            "label": "genotype GVCF", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "stand_call_conf", 
                    "valueFrom": "=5.0"
                }, 
                {
                    "position": 0, 
                    "prefix": "stand_emit_conf", 
                    "valueFrom": "=5.0"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#genotypeGVCFs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#lovd.cwl", 
            "baseCommand": [], 
            "inputs": [
                {
                    "id": "#lovd.cwl/table", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#lovd.cwl/insert_size_metrics", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#lovd.cwl/depth_of_coverage", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }, 
                {
                    "id": "#lovd.cwl/stage_report", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#lovd.cwl/table2", 
                    "label": "table", 
                    "type": "File"
                }
            ], 
            "label": "LOVD"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "picard.jar", 
                "MarkDuplicates"
            ], 
            "inputs": [
                {
                    "format": null, 
                    "id": "#mark_duplicates.cwl/sorted_aligned_bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/sorted.aligned.bam"
                    }, 
                    "doc": "Check secondary file requirement.", 
                    "secondaryFiles": [
                        "index.ai"
                    ]
                }, 
                {
                    "id": "#mark_duplicates.cwl/sorted_aligned_bam.ai", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#mark_duplicates.cwl/dedup_metrics", 
                    "doc": "Text file containing summaries of duplicate metrics.", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_3475"
                }, 
                {
                    "id": "#mark_duplicates.cwl/deduped_bam", 
                    "doc": "Deduped, merged and sorted bam file.", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_2572"
                }
            ], 
            "doc": "http://picard.sourceforge.net\n", 
            "label": "identify and mark pcr duplicates.", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "CREATE_INDEX", 
                    "separate": false, 
                    "valueFrom": "=true"
                }, 
                {
                    "position": 0, 
                    "prefix": "REMOVE_DUPLICATES", 
                    "separate": false, 
                    "valueFrom": "=true"
                }, 
                {
                    "position": 0, 
                    "prefix": "VALIDATION_STRINGENCY", 
                    "separate": false, 
                    "valueFrom": "=LENIENT"
                }, 
                {
                    "position": 0, 
                    "prefix": "AS", 
                    "separate": false, 
                    "valueFrom": "=true"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_006525"
                            ], 
                            "version": [
                                "2.6.0"
                            ], 
                            "package": "picard--markduplicates"
                        }
                    ]
                }
            ], 
            "id": "#mark_duplicates.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "picard.jar", 
                "MergeSamFiles"
            ], 
            "inputs": [
                {
                    "format": null, 
                    "id": "#merge_alignments.cwl/sorted.bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }, 
                    "doc": "Merge of bam files if multiple bams due to an individual being sequenced over several lanes.", 
                    "secondaryFiles": [
                        "bam.ai"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#merge_alignments.cwl/aligned_merged_bam", 
                    "doc": "Merged and sorted bam file.\n\nCheck secondary index requirements.", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_2572"
                }
            ], 
            "doc": "http://bio-bwa.sourceforge.net/bwa.shtml\n", 
            "label": "merge bam files", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "ASSUME_SORTED", 
                    "separate": false, 
                    "valueFrom": "=true"
                }, 
                {
                    "position": 0, 
                    "prefix": "CREATE_INDEX", 
                    "separate": false, 
                    "valueFrom": "=true"
                }, 
                {
                    "position": 0, 
                    "prefix": "VALIDATION_STRINGENCY", 
                    "separate": false, 
                    "valueFrom": "=LENIENT"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_006525"
                            ], 
                            "version": [
                                "2.6.0"
                            ], 
                            "package": "picard--mergeSamFiles"
                        }
                    ]
                }
            ], 
            "id": "#merge_alignments.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "CombineVariants"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#merge_variants.cwl/indel_g_gvcf", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/vcf/indel_g_gvcf"
                    }
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#merge_variants.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#merge_variants.cwl/snv_g_gvcf", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/vcf/snv_g_gvcf"
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#merge_variants.cwl/merged_variants_vcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_3016"
                }
            ], 
            "label": "merge variants", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "genotypemergeoption", 
                    "valueFrom": "=UNSORTED"
                }, 
                {
                    "position": 0, 
                    "prefix": "setKey", 
                    "valueFrom": "=set"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#merge_variants.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "IndelRealigner"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_2572", 
                    "id": "#perform_realignment.cwl/deduped_bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/deduped.bam"
                    }
                }, 
                {
                    "format": "http://edamontology.org/format_3475", 
                    "id": "#perform_realignment.cwl/interval_list", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/interval_list"
                    }, 
                    "doc": "Coordinates for regions discovered requiring realignment."
                }, 
                {
                    "format": "http://edamontology.org/data_2340", 
                    "id": "#perform_realignment.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#perform_realignment.cwl/deduped_realigned_bam", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "secondaryFiles": [
                        "bam.index"
                    ], 
                    "format": "http://edamontology.org/format_2572"
                }
            ], 
            "doc": "https://bio.tools/tool/gatk2_indel_realigner-IP/version/none\n", 
            "label": "perform local realignment of indel sites.", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "taregtIntervals", 
                    "valueFrom": "=intervals"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#perform_realignment.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "RealignerTargetCreator"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_2572", 
                    "id": "#realign_intervals.cwl/deduped_bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/align/deduped_bam"
                    }, 
                    "secondaryFiles": [
                        "bam.ai"
                    ]
                }, 
                {
                    "format": null, 
                    "id": "#realign_intervals.cwl/known_indel_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/known_indel_sites"
                    }, 
                    "doc": "Mills & 1000G reference indels"
                }, 
                {
                    "format": "http://edamontology.org/data_2340", 
                    "id": "#realign_intervals.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_3003", 
                    "id": "#realign_intervals.cwl/target_sites", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/target_sites"
                    }, 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted."
                }
            ], 
            "outputs": [
                {
                    "id": "#realign_intervals.cwl/realigned_intervals", 
                    "doc": "Coordinates for regions discovered requiring realignment.", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_3475"
                }
            ], 
            "doc": "https://bio.tools/tool/gatk2_realigner_target_c/version/none\n", 
            "label": "discover indel sites in need of realignment.", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "interval_padding", 
                    "separate": false, 
                    "valueFrom": "=25"
                }, 
                {
                    "position": 0, 
                    "prefix": "known", 
                    "separate": false, 
                    "valueFrom": "=MIlls_and_1000G_gold_standard.indels"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#realign_intervals.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#samtools-index.cwl", 
            "baseCommand": [
                "samtools", 
                "index"
            ], 
            "inputs": [
                {
                    "id": "#samtools-index.cwl/bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#samtools-index.cwl/sorted.bam.ai", 
                    "type": "File", 
                    "outputBinding": {}
                }, 
                {
                    "id": "#samtools-index.cwl/sorted.bam", 
                    "label": "sorted.bam", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "samtools-index"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#samtools-sort.cwl", 
            "baseCommand": [
                "samtools", 
                "sort"
            ], 
            "inputs": [
                {
                    "id": "#samtools-sort.cwl/aligned.sam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#samtools-sort.cwl/sorted.bam", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "samtools-sort"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#samtools-view.cwl", 
            "baseCommand": [
                "samtools", 
                "view", 
                "|"
            ], 
            "inputs": [
                {
                    "id": "#samtools-view.cwl/bam", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#samtools-view.cwl/sam", 
                    "label": "tmp.align.sam", 
                    "type": "File"
                }
            ]
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "SelectVariants"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#select_indels.cwl/raw_variants_g_gvcf", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/vcf/raw_variants_g_gvcf"
                    }
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#select_indels.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#select_indels.cwl/indel_g_gvcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "label": "select variants - indel", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "interval_padding"
                }, 
                {
                    "position": 0, 
                    "prefix": "select_type_to_include"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#select_indels.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "-T", 
                "SelectVariants"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#select_snvs.cwl/raw_variants_g_gvcf", 
                    "type": "File", 
                    "secondaryFiles": [
                        "vcf.index"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#select_snvs.cwl/reference_assembly", 
                    "type": "File", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#select_snvs.cwl/snv_g_gvcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "label": "select variants - snvs", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "interval_padding"
                }, 
                {
                    "position": 0, 
                    "prefix": "select_type_to_include"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "3.6"
                            ], 
                            "package": "gatk-toolkit"
                        }
                    ]
                }
            ], 
            "id": "#select_snvs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "python", 
                "filter_transcripts.py"
            ], 
            "inputs": [
                {
                    "id": "#transcript_filter.cwl/flattened_table", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#transcript_filter.cwl/transcript_filtered_table", 
                    "label": "LOVD ready table", 
                    "type": "File"
                }
            ], 
            "label": "transcript_filter - remove multiple transcripts", 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "filter_transcripts.py"
                        }
                    ]
                }
            ], 
            "id": "#transcript_filter.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "perl", 
                "variant_effect_predictor.pl"
            ], 
            "inputs": [
                {
                    "default": "", 
                    "id": "#vcf_annotate.cwl/Grantham_plugin", 
                    "type": "string", 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "--plugin"
                    }, 
                    "doc": "[Grantham]"
                }, 
                {
                    "default": "", 
                    "id": "#vcf_annotate.cwl/condel_plugin", 
                    "type": "string", 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "--plugin"
                    }, 
                    "doc": "[Condel]"
                }, 
                {
                    "default": "", 
                    "id": "#vcf_annotate.cwl/dbNSFP", 
                    "type": "string", 
                    "inputBinding": {
                        "position": 0, 
                        "prefix": "--plugin"
                    }, 
                    "doc": "[dbNSFP]"
                }, 
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#vcf_annotate.cwl/input_vcf", 
                    "type": "File"
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#vcf_annotate.cwl/reference_assembly_2", 
                    "type": "File", 
                    "doc": "Homo_sapiens.GRCh37.75.dna.primary_assembly.fa from VEP cache"
                }, 
                {
                    "format": null, 
                    "id": "#vcf_annotate.cwl/vep_cache", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#vcf_annotate.cwl/vep_annotated_vcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": null
                }
            ], 
            "doc": "\"http://www.ensembl.org/info/docs/tools/vep/index.html\"\n", 
            "label": "vcf annotate", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "--plugin", 
                    "separate": false, 
                    "valueFrom": "condel"
                }, 
                {
                    "position": 0, 
                    "prefix": "--plugin", 
                    "separate": false, 
                    "valueFrom": "dbNSFP"
                }, 
                {
                    "position": 0, 
                    "prefix": "--plugin", 
                    "separate": false, 
                    "valueFrom": "Grantham"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "85"
                            ], 
                            "package": "vep"
                        }
                    ]
                }
            ], 
            "id": "#vcf_annotate.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "bcftools", 
                "norm"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#vcf_normalize.cwl/merged_variants_vcf", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/vcf/merged_variants_vcf"
                    }, 
                    "secondaryFiles": [
                        "vcf.index"
                    ]
                }, 
                {
                    "format": "http://edamontology.org/format_1929", 
                    "id": "#vcf_normalize.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0, 
                        "valueFrom": "/ref/reference_assembly"
                    }, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#vcf_normalize.cwl/normalized_g_vcf", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "secondaryFiles": [
                        "vcf.index"
                    ], 
                    "format": "http://edamontology.org/format_3016"
                }
            ], 
            "doc": "http://samtools.sourceforge.net/mpileup.shtml\n", 
            "label": "vcf normalize", 
            "arguments": [
                {
                    "position": 0, 
                    "prefix": "", 
                    "valueFrom": "-m"
                }, 
                {
                    "position": 0, 
                    "prefix": "", 
                    "valueFrom": "-both"
                }
            ], 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_001876"
                            ], 
                            "version": [
                                "1.3"
                            ], 
                            "package": "bcftools"
                        }
                    ]
                }
            ], 
            "id": "#vcf_normalize.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "baseCommand": [
                "bash", 
                "vcf_to_table.sh"
            ], 
            "inputs": [
                {
                    "format": "http://edamontology.org/format_3016", 
                    "id": "#vcf_to_table.cwl/post_anno_vcf", 
                    "type": "File"
                }, 
                {
                    "id": "#vcf_to_table.cwl/reference_assembly", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#vcf_to_table.cwl/variant_table_tsv", 
                    "type": "File", 
                    "outputBinding": {}, 
                    "format": "http://edamontology.org/format_3475"
                }
            ], 
            "label": "vcf_to_table filter", 
            "hints": [
                {
                    "class": "SoftwareRequirement", 
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "vcf_to_table.sh"
                        }
                    ]
                }
            ], 
            "id": "#vcf_to_table.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "id": "#write_karyotype.cwl", 
            "baseCommand": [
                "qc_report.py"
            ], 
            "inputs": [
                {
                    "id": "#write_karyotype.cwl/exome_cov.gz", 
                    "type": "File", 
                    "inputBinding": {
                        "position": 0
                    }
                }
            ], 
            "outputs": [
                {
                    "id": "#write_karyotype.cwl/karyotype.tsv", 
                    "type": "File", 
                    "outputBinding": {}
                }
            ], 
            "label": "write_karyotype"
        }, 
        {
            "class": "Workflow", 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }, 
                {
                    "class": "ScatterFeatureRequirement"
                }
            ], 
            "doc": "WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe.", 
            "label": "Detect Variants workflow", 
            "inputs": [
                {
                    "id": "#main/forward_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }, 
                {
                    "id": "#main/known_indel_sites", 
                    "type": "File"
                }, 
                {
                    "id": "#main/known_snp_sites", 
                    "type": "File", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ]
                }, 
                {
                    "id": "#main/reference_assembly", 
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ]
                }, 
                {
                    "id": "#main/reference_assembly_2", 
                    "type": "File", 
                    "doc": "This is used by VEP."
                }, 
                {
                    "id": "#main/reverse_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }, 
                {
                    "id": "#main/target_sites", 
                    "type": "File", 
                    "doc": "bed File containing coordinates for intersection of exons and library captures sites.", 
                    "format": "edam:format_3003"
                }, 
                {
                    "id": "#main/vep_cache", 
                    "type": "File", 
                    "doc": "database of annotations."
                }, 
                {
                    "id": "#main/capture_coverage", 
                    "type": "File"
                }, 
                {
                    "id": "#main/intersect.bed", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#main/fastqc_report_forward", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_forward", 
                    "type": "File"
                }, 
                {
                    "id": "#main/fastqc_report_reverse", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_reverse", 
                    "type": "File"
                }, 
                {
                    "id": "#main/summary.md", 
                    "outputSource": [
                        "#main/generate_quality_metrics_cwl/summary.md"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#main/karyotype.tsv", 
                    "outputSource": [
                        "#main/generate_quality_metrics_cwl/karyotype.tsv"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#main/gzip.gz", 
                    "outputSource": [
                        "#main/generate_quality_metrics_cwl/gzip.gz"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#main/fragments.tsv", 
                    "outputSource": [
                        "#main/generate_quality_metrics_cwl/fragments.tsv"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#main/insert_size_metrics.pdf", 
                    "outputSource": [
                        "#main/generate_quality_metrics_cwl/insert_size_metrics.pdf"
                    ], 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#main/post_alignment_processing", 
                    "in": [
                        {
                            "id": "#main/post_alignment_processing/aligned_merged_bam", 
                            "source": [
                                "#main/read_alignment/aligned_merged_bam"
                            ]
                        }, 
                        {
                            "id": "#main/post_alignment_processing/known_indel_sites", 
                            "source": [
                                "#main/known_indel_sites"
                            ]
                        }, 
                        {
                            "id": "#main/post_alignment_processing/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#main/post_alignment_processing/target_sites", 
                            "source": [
                                "#main/target_sites"
                            ]
                        }, 
                        {
                            "id": "#main/post_alignment_processing/dbsnp_ID", 
                            "source": [
                                "#main/known_snp_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/post_alignment_processing/dedup_metrics"
                        }, 
                        {
                            "id": "#main/post_alignment_processing/recalibrated_bam"
                        }
                    ], 
                    "run": "#post_alignment_processing.cwl", 
                    "label": "post_alignment_processing"
                }, 
                {
                    "id": "#main/post_annotation_processing", 
                    "in": [
                        {
                            "id": "#main/post_annotation_processing/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#main/post_annotation_processing/post_anno_vcf", 
                            "source": [
                                "#main/variant_annotation/vep_annotated_vcf"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/post_annotation_processing/transcript_filtered_table"
                        }
                    ], 
                    "run": "#post_annotation_processing.cwl", 
                    "label": "post_annotation_processing"
                }, 
                {
                    "id": "#main/post_variant_processing", 
                    "in": [
                        {
                            "id": "#main/post_variant_processing/raw_variants_g_gvcf", 
                            "source": [
                                "#main/variant_calling/raw_variants_g_gvcf"
                            ]
                        }, 
                        {
                            "id": "#main/post_variant_processing/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/post_variant_processing/normalized_g_vcf"
                        }
                    ], 
                    "run": "#post_variant_processing.cwl", 
                    "label": "post_variant_processing"
                }, 
                {
                    "id": "#main/read_alignment", 
                    "in": [
                        {
                            "id": "#main/read_alignment/forward_reads", 
                            "source": [
                                "#main/forward_reads"
                            ]
                        }, 
                        {
                            "id": "#main/read_alignment/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#main/read_alignment/reverse_reads", 
                            "source": [
                                "#main/reverse_reads"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/read_alignment/aligned_merged_bam"
                        }
                    ], 
                    "run": "#read_alignment.cwl", 
                    "label": "read_alignment"
                }, 
                {
                    "id": "#main/read_quality_assessment", 
                    "in": [
                        {
                            "id": "#main/read_quality_assessment/forward_reads", 
                            "source": [
                                "#main/forward_reads"
                            ]
                        }, 
                        {
                            "id": "#main/read_quality_assessment/reverse_reads", 
                            "source": [
                                "#main/reverse_reads"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/read_quality_assessment/fastqc_report_forward"
                        }, 
                        {
                            "id": "#main/read_quality_assessment/fastqc_report_reverse"
                        }
                    ], 
                    "run": "#read_quality_assessment.cwl", 
                    "label": "read_quality_assessment"
                }, 
                {
                    "id": "#main/variant_annotation", 
                    "in": [
                        {
                            "id": "#main/variant_annotation/normalized_g_vcf", 
                            "source": [
                                "#main/post_variant_processing/normalized_g_vcf"
                            ]
                        }, 
                        {
                            "id": "#main/variant_annotation/reference_assembly_2", 
                            "source": [
                                "#main/reference_assembly_2"
                            ]
                        }, 
                        {
                            "id": "#main/variant_annotation/vep_cache", 
                            "source": [
                                "#main/vep_cache"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/variant_annotation/vep_annotated_vcf"
                        }
                    ], 
                    "run": "#variant_annotation.cwl", 
                    "label": "variant_annotation"
                }, 
                {
                    "id": "#main/variant_calling", 
                    "in": [
                        {
                            "id": "#main/variant_calling/known_snp_sites", 
                            "source": [
                                "#main/known_snp_sites"
                            ]
                        }, 
                        {
                            "id": "#main/variant_calling/recalibrated_bam", 
                            "source": [
                                "#main/post_alignment_processing/recalibrated_bam"
                            ]
                        }, 
                        {
                            "id": "#main/variant_calling/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#main/variant_calling/target_sites", 
                            "source": [
                                "#main/target_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/variant_calling/raw_variants_g_gvcf"
                        }
                    ], 
                    "run": "#variant_calling.cwl", 
                    "label": "variant_calling"
                }, 
                {
                    "id": "#main/generate_quality_metrics_cwl", 
                    "in": [
                        {
                            "id": "#main/generate_quality_metrics_cwl/recalibrated.bam", 
                            "source": [
                                "#main/post_alignment_processing/recalibrated_bam"
                            ]
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/reference_assembly", 
                            "source": [
                                "#main/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/target_sites", 
                            "source": [
                                "#main/target_sites"
                            ]
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/intersect.bed", 
                            "source": [
                                "#main/intersect.bed"
                            ]
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/dedup_metrics", 
                            "source": [
                                "#main/post_alignment_processing/dedup_metrics"
                            ]
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/capture_coverage", 
                            "source": [
                                "#main/capture_coverage"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/generate_quality_metrics_cwl/gzip.gz"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/karyotype.tsv"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/fragments.tsv"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/summary.md"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/summary.htm"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/coverage"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/insert_size_metrics.txt"
                        }, 
                        {
                            "id": "#main/generate_quality_metrics_cwl/insert_size_metrics.pdf"
                        }
                    ], 
                    "run": "#generate_quality_metrics.cwl", 
                    "label": "generate_quality_metrics"
                }, 
                {
                    "id": "#main/lovd_cwl", 
                    "in": [
                        {
                            "id": "#main/lovd_cwl/table", 
                            "source": [
                                "#main/post_annotation_processing/transcript_filtered_table"
                            ]
                        }, 
                        {
                            "id": "#main/lovd_cwl/insert_size_metrics", 
                            "source": [
                                "#main/generate_quality_metrics_cwl/insert_size_metrics.txt"
                            ]
                        }, 
                        {
                            "id": "#main/lovd_cwl/depth_of_coverage", 
                            "source": [
                                "#main/generate_quality_metrics_cwl/coverage"
                            ]
                        }, 
                        {
                            "id": "#main/lovd_cwl/stage_report", 
                            "source": [
                                "#main/generate_quality_metrics_cwl/summary.htm"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#main/lovd_cwl/table2"
                        }
                    ], 
                    "run": "#lovd.cwl", 
                    "label": "LOVD+"
                }
            ], 
            "id": "#main"
        }, 
        {
            "class": "Workflow", 
            "id": "#generate_quality_metrics.cwl", 
            "label": "generate_quality_metrics", 
            "inputs": [
                {
                    "id": "#generate_quality_metrics.cwl/recalibrated.bam", 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/target_sites", 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/intersect.bed", 
                    "type": "File", 
                    "label": "capture_sites"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/dedup_metrics", 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/capture_coverage", 
                    "type": "File", 
                    "label": "capture_intersect_exons"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/reference_assembly", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#generate_quality_metrics.cwl/gzip.gz", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/coveragebed_cwl/gzip.gz"
                    ], 
                    "type": "File", 
                    "label": "coverage.gz"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/karyotype.tsv", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/write_karyotype_cwl/karyotype.tsv"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/fragments.tsv", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/fragment_qc_stats_cwl/fragments.tsv"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/summary.md", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/generate_summary_report_cwl/summary.md"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/summary.htm", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/generate_summary_report_cwl/summary.htm"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/coverage", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/depth_of_coverage_cwl/coverage"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/insert_size_metrics.txt", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl/insert_size_metrics.txt"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/insert_size_metrics.pdf", 
                    "outputSource": [
                        "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl/insert_size_metrics.pdf"
                    ], 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#generate_quality_metrics.cwl/bedtools_intersect_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/bedtools_intersect_cwl/bed_a", 
                            "source": [
                                "#generate_quality_metrics.cwl/target_sites"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/bedtools_intersect_cwl/bed_b", 
                            "source": [
                                "#generate_quality_metrics.cwl/intersect.bed"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/bedtools_intersect_cwl/intersect_bed"
                        }
                    ], 
                    "run": "#bedtools-intersect.cwl", 
                    "label": "bedtools-intersect"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/bedtools_bamtobed_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/bedtools_bamtobed_cwl/recalibrated.bam", 
                            "source": [
                                "#generate_quality_metrics.cwl/recalibrated.bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/bedtools_bamtobed_cwl/bed"
                        }
                    ], 
                    "run": "#bedtools-bamtobed.cwl", 
                    "label": "bedtools-bamtobed"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/coveragebed_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/coveragebed_cwl/intersect.bed", 
                            "source": [
                                "#generate_quality_metrics.cwl/bedtools_intersect_cwl/intersect_bed"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/coveragebed_cwl/recal.bed", 
                            "source": [
                                "#generate_quality_metrics.cwl/bedtools_bamtobed_cwl/bed"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/coveragebed_cwl/gzip.gz"
                        }
                    ], 
                    "run": "#coveragebed.cwl", 
                    "label": "coverageBed"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/samtools_view_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/samtools_view_cwl/bam", 
                            "source": [
                                "#generate_quality_metrics.cwl/recalibrated.bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/samtools_view_cwl/sam"
                        }
                    ], 
                    "run": "#samtools-view.cwl", 
                    "label": "samtools-view"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/write_karyotype_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/write_karyotype_cwl/exome_cov.gz", 
                            "source": [
                                "#generate_quality_metrics.cwl/coveragebed_cwl/gzip.gz"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/write_karyotype_cwl/karyotype.tsv"
                        }
                    ], 
                    "run": "#write_karyotype.cwl", 
                    "label": "write_karyotype"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/fragment_qc_stats_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/fragment_qc_stats_cwl/sam", 
                            "source": [
                                "#generate_quality_metrics.cwl/samtools_view_cwl/sam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/fragment_qc_stats_cwl/fragments.tsv"
                        }
                    ], 
                    "run": "#fragment_qc_stats.cwl", 
                    "label": "fragment_qc_stats"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/report_cov", 
                            "source": [
                                "#generate_quality_metrics.cwl/coveragebed_cwl/gzip.gz"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/exome_cov", 
                            "source": [
                                "#generate_quality_metrics.cwl/coveragebed_cwl/gzip.gz"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/metrics", 
                            "source": [
                                "#generate_quality_metrics.cwl/dedup_metrics"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/gene_cov", 
                            "source": [
                                "#generate_quality_metrics.cwl/capture_coverage"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/fragments", 
                            "source": [
                                "#generate_quality_metrics.cwl/fragment_qc_stats_cwl/fragments.tsv"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/karyotype", 
                            "source": [
                                "#generate_quality_metrics.cwl/write_karyotype_cwl/karyotype.tsv"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/summary.md"
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/generate_summary_report_cwl/summary.htm"
                        }
                    ], 
                    "run": "#generate_summary_report.cwl", 
                    "label": "generate_summary_report"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/depth_of_coverage_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/depth_of_coverage_cwl/reference_assembly", 
                            "source": [
                                "#generate_quality_metrics.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/depth_of_coverage_cwl/recal.bam", 
                            "source": [
                                "#generate_quality_metrics.cwl/recalibrated.bam"
                            ]
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/depth_of_coverage_cwl/target_sites.bed", 
                            "source": [
                                "#generate_quality_metrics.cwl/target_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/depth_of_coverage_cwl/coverage"
                        }
                    ], 
                    "run": "#depth_of_coverage.cwl", 
                    "label": "depth_of_coverage"
                }, 
                {
                    "id": "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl", 
                    "in": [
                        {
                            "id": "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl/recal.bam", 
                            "source": [
                                "#generate_quality_metrics.cwl/recalibrated.bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl/insert_size_metrics.txt"
                        }, 
                        {
                            "id": "#generate_quality_metrics.cwl/collect_insertsize_metrics_cwl/insert_size_metrics.pdf"
                        }
                    ], 
                    "run": "#collect_insertsize_metrics.cwl", 
                    "label": "collect_insertsize_metrics"
                }
            ]
        }, 
        {
            "class": "Workflow", 
            "label": "post_alignment_processing", 
            "inputs": [
                {
                    "id": "#post_alignment_processing.cwl/known_indel_sites", 
                    "type": "File", 
                    "secondaryFiles": [
                        ".tbi"
                    ]
                }, 
                {
                    "id": "#post_alignment_processing.cwl/reference_assembly", 
                    "type": "File", 
                    "label": "ref_assembly_build_hg19", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ]
                }, 
                {
                    "id": "#post_alignment_processing.cwl/target_sites", 
                    "type": "File", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "format": "edam:format_3003"
                }, 
                {
                    "id": "#post_alignment_processing.cwl/dbsnp_ID", 
                    "type": "File"
                }, 
                {
                    "id": "#post_alignment_processing.cwl/aligned_merged_bam", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#post_alignment_processing.cwl/dedup_metrics", 
                    "outputSource": "#post_alignment_processing.cwl/mark_duplicates/dedup_metrics", 
                    "type": "File"
                }, 
                {
                    "id": "#post_alignment_processing.cwl/recalibrated_bam", 
                    "outputSource": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam", 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#post_alignment_processing.cwl/apply_recalibration", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/apply_recalibration/deduped_realigned_bam", 
                            "source": [
                                "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_table", 
                            "source": [
                                "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/apply_recalibration/reference_assembly", 
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/apply_recalibration/target_sites", 
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam"
                        }
                    ], 
                    "run": "#apply_bqsr.cwl", 
                    "label": "gatk-printReads version 3.6", 
                    "doc": "overwrite quality scores with re-calibrated values."
                }, 
                {
                    "id": "#post_alignment_processing.cwl/base_quality_recalibration", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/deduped_realigned_bam", 
                            "source": [
                                "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/reference_assembly", 
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/target_sites", 
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/dbsnp_ID", 
                            "source": [
                                "#post_alignment_processing.cwl/dbsnp_ID"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table"
                        }
                    ], 
                    "run": "#bsqr.cwl", 
                    "label": "gatk-baseRecalibrator version 3.6", 
                    "doc": "recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes)."
                }, 
                {
                    "id": "#post_alignment_processing.cwl/mark_duplicates", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/mark_duplicates/sorted_aligned_bam", 
                            "source": [
                                "#post_alignment_processing.cwl/samtools_index_cwl/sorted.bam"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/mark_duplicates/sorted_aligned_bam.ai", 
                            "source": [
                                "#post_alignment_processing.cwl/samtools_index_cwl/sorted.bam.ai"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/mark_duplicates/dedup_metrics"
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/mark_duplicates/deduped_bam"
                        }
                    ], 
                    "run": "#mark_duplicates.cwl", 
                    "label": "picard-markDuplicates", 
                    "doc": "identify pcr duplicates and mark."
                }, 
                {
                    "id": "#post_alignment_processing.cwl/perform_realignment", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/perform_realignment/deduped_bam", 
                            "source": [
                                "#post_alignment_processing.cwl/mark_duplicates/deduped_bam"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/perform_realignment/interval_list", 
                            "source": [
                                "#post_alignment_processing.cwl/realign_intervals/realigned_intervals"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/perform_realignment/reference_assembly", 
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam"
                        }
                    ], 
                    "run": "#perform_realignment.cwl", 
                    "label": "gatk-IndelRealigner version 3.6", 
                    "doc": "perform realignment and generate new vcf with updated coords."
                }, 
                {
                    "id": "#post_alignment_processing.cwl/realign_intervals", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/realign_intervals/deduped_bam", 
                            "source": [
                                "#post_alignment_processing.cwl/mark_duplicates/deduped_bam"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/realign_intervals/known_indel_sites", 
                            "source": [
                                "#post_alignment_processing.cwl/known_indel_sites"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/realign_intervals/reference_assembly", 
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/realign_intervals/target_sites", 
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/realign_intervals/realigned_intervals"
                        }
                    ], 
                    "run": "#realign_intervals.cwl", 
                    "label": "gatk-RealignerTargetCreator version 3.6", 
                    "doc": "dentify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment."
                }, 
                {
                    "id": "#post_alignment_processing.cwl/samtools_view_cwl", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_view_cwl/bam", 
                            "source": [
                                "#post_alignment_processing.cwl/aligned_merged_bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_view_cwl/sam"
                        }
                    ], 
                    "run": "#samtools-view.cwl", 
                    "label": "samtools-view"
                }, 
                {
                    "id": "#post_alignment_processing.cwl/samtools_sort_cwl", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_sort_cwl/aligned.sam", 
                            "source": [
                                "#post_alignment_processing.cwl/samtools_view_cwl/sam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_sort_cwl/sorted.bam"
                        }
                    ], 
                    "run": "#samtools-sort.cwl", 
                    "label": "samtools-sort"
                }, 
                {
                    "id": "#post_alignment_processing.cwl/samtools_index_cwl", 
                    "in": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_index_cwl/bam", 
                            "source": [
                                "#post_alignment_processing.cwl/samtools_sort_cwl/sorted.bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_alignment_processing.cwl/samtools_index_cwl/sorted.bam.ai"
                        }, 
                        {
                            "id": "#post_alignment_processing.cwl/samtools_index_cwl/sorted.bam"
                        }
                    ], 
                    "run": "#samtools-index.cwl", 
                    "label": "samtools-index"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#post_alignment_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_annotation_processing", 
            "inputs": [
                {
                    "id": "#post_annotation_processing.cwl/reference_assembly", 
                    "type": "File"
                }, 
                {
                    "id": "#post_annotation_processing.cwl/post_anno_vcf", 
                    "type": "File"
                }
            ], 
            "outputs": [
                {
                    "id": "#post_annotation_processing.cwl/transcript_filtered_table", 
                    "outputSource": [
                        "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table"
                    ], 
                    "type": "File", 
                    "label": "LOVD ready table"
                }
            ], 
            "steps": [
                {
                    "id": "#post_annotation_processing.cwl/vcf_to_table", 
                    "in": [
                        {
                            "id": "#post_annotation_processing.cwl/vcf_to_table/post_anno_vcf", 
                            "source": [
                                "#post_annotation_processing.cwl/post_anno_vcf"
                            ]
                        }, 
                        {
                            "id": "#post_annotation_processing.cwl/vcf_to_table/reference_assembly", 
                            "source": [
                                "#post_annotation_processing.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv"
                        }
                    ], 
                    "run": "#vcf_to_table.cwl", 
                    "label": "vcf_to_table filter"
                }, 
                {
                    "id": "#post_annotation_processing.cwl/filter_table", 
                    "in": [
                        {
                            "id": "#post_annotation_processing.cwl/filter_table/variant_table_tsv", 
                            "source": [
                                "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_annotation_processing.cwl/filter_table/filtered_variant_table"
                        }
                    ], 
                    "run": "#filter_table.cwl", 
                    "label": "filter_table - based on quality scores"
                }, 
                {
                    "id": "#post_annotation_processing.cwl/convert_table_lovd", 
                    "in": [
                        {
                            "id": "#post_annotation_processing.cwl/convert_table_lovd/filtered_variant_table", 
                            "source": [
                                "#post_annotation_processing.cwl/filter_table/filtered_variant_table"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_annotation_processing.cwl/convert_table_lovd/flattened_table"
                        }
                    ], 
                    "run": "#convert_table_lovd.cwl", 
                    "label": "convert_table_lovd - for LOVD"
                }, 
                {
                    "id": "#post_annotation_processing.cwl/transcript_filter", 
                    "in": [
                        {
                            "id": "#post_annotation_processing.cwl/transcript_filter/flattened_table", 
                            "source": [
                                "#post_annotation_processing.cwl/convert_table_lovd/flattened_table"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table"
                        }
                    ], 
                    "run": "#transcript_filter.cwl", 
                    "label": "transcript_filter - remove multiple transcripts"
                }
            ], 
            "id": "#post_annotation_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_variant_processing", 
            "inputs": [
                {
                    "id": "#post_variant_processing.cwl/raw_variants_g_gvcf", 
                    "type": "File"
                }, 
                {
                    "id": "#post_variant_processing.cwl/reference_assembly", 
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ]
                }
            ], 
            "outputs": [
                {
                    "id": "#post_variant_processing.cwl/normalized_g_vcf", 
                    "outputSource": "#post_variant_processing.cwl/vcf_normalize/normalized_g_vcf", 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#post_variant_processing.cwl/merge_variants", 
                    "in": [
                        {
                            "id": "#post_variant_processing.cwl/merge_variants/indel_g_gvcf", 
                            "source": [
                                "#post_variant_processing.cwl/select_indels/indel_g_gvcf"
                            ]
                        }, 
                        {
                            "id": "#post_variant_processing.cwl/merge_variants/reference_assembly", 
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#post_variant_processing.cwl/merge_variants/snv_g_gvcf", 
                            "source": [
                                "#post_variant_processing.cwl/select_snvs/snv_g_gvcf"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_variant_processing.cwl/merge_variants/merged_variants_vcf"
                        }
                    ], 
                    "run": "#merge_variants.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "merge filtered indel and snv vcfs"
                }, 
                {
                    "id": "#post_variant_processing.cwl/select_indels", 
                    "in": [
                        {
                            "id": "#post_variant_processing.cwl/select_indels/raw_variants_g_gvcf", 
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_g_gvcf"
                            ]
                        }, 
                        {
                            "id": "#post_variant_processing.cwl/select_indels/reference_assembly", 
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_variant_processing.cwl/select_indels/indel_g_gvcf"
                        }
                    ], 
                    "run": "#select_indels.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract indel mutations only. This is necessary so that indel-specific filters can be applied."
                }, 
                {
                    "id": "#post_variant_processing.cwl/select_snvs", 
                    "in": [
                        {
                            "id": "#post_variant_processing.cwl/select_snvs/raw_variants_g_gvcf", 
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_g_gvcf"
                            ]
                        }, 
                        {
                            "id": "#post_variant_processing.cwl/select_snvs/reference_assembly", 
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_variant_processing.cwl/select_snvs/snv_g_gvcf"
                        }
                    ], 
                    "run": "#select_snvs.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract all but indel mutations types so that hard filters can be applied."
                }, 
                {
                    "id": "#post_variant_processing.cwl/vcf_normalize", 
                    "in": [
                        {
                            "id": "#post_variant_processing.cwl/vcf_normalize/merged_variants_vcf", 
                            "source": [
                                "#post_variant_processing.cwl/merge_variants/merged_variants_vcf"
                            ]
                        }, 
                        {
                            "id": "#post_variant_processing.cwl/vcf_normalize/reference_assembly", 
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#post_variant_processing.cwl/vcf_normalize/normalized_g_vcf"
                        }
                    ], 
                    "run": "#vcf_normalize.cwl", 
                    "label": "bcftools version 1.3", 
                    "doc": "normalisation and split multi-allelic sites"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#post_variant_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_alignment", 
            "inputs": [
                {
                    "id": "#read_alignment.cwl/forward_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }, 
                {
                    "id": "#read_alignment.cwl/reference_assembly", 
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ]
                }, 
                {
                    "id": "#read_alignment.cwl/reverse_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }
            ], 
            "outputs": [
                {
                    "id": "#read_alignment.cwl/aligned_merged_bam", 
                    "outputSource": "#read_alignment.cwl/merge_alignments/aligned_merged_bam", 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#read_alignment.cwl/align_to_ref", 
                    "in": [
                        {
                            "id": "#read_alignment.cwl/align_to_ref/forward_reads.gz", 
                            "source": [
                                "#read_alignment.cwl/forward_reads"
                            ]
                        }, 
                        {
                            "id": "#read_alignment.cwl/align_to_ref/reference_assembly.fasta", 
                            "source": [
                                "#read_alignment.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#read_alignment.cwl/align_to_ref/reverse_reads.gz", 
                            "source": [
                                "#read_alignment.cwl/reverse_reads"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#read_alignment.cwl/align_to_ref/ref_aligned_bam"
                        }
                    ], 
                    "run": "#align.cwl", 
                    "label": "bwa-mem version 0.7.13", 
                    "doc": "align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment."
                }, 
                {
                    "id": "#read_alignment.cwl/merge_alignments", 
                    "in": [
                        {
                            "id": "#read_alignment.cwl/merge_alignments/sorted.bam", 
                            "source": [
                                "#read_alignment.cwl/align_to_ref/ref_aligned_bam"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#read_alignment.cwl/merge_alignments/aligned_merged_bam"
                        }
                    ], 
                    "run": "#merge_alignments.cwl", 
                    "label": "picard-mergSamFiles v2.6.0", 
                    "doc": "merge individual alignments representing sequencing lanes."
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#read_alignment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_quality_assessment", 
            "inputs": [
                {
                    "id": "#read_quality_assessment.cwl/forward_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }, 
                {
                    "id": "#read_quality_assessment.cwl/reverse_reads", 
                    "type": "File", 
                    "format": "edam:format_1930"
                }
            ], 
            "outputs": [
                {
                    "id": "#read_quality_assessment.cwl/fastqc_report_reverse", 
                    "outputSource": [
                        "#read_quality_assessment.cwl/read_quality/fastqc_report_reverse"
                    ], 
                    "type": "File"
                }, 
                {
                    "id": "#read_quality_assessment.cwl/fastqc_report_forward", 
                    "outputSource": [
                        "#read_quality_assessment.cwl/read_quality/fastqc_report_forward"
                    ], 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#read_quality_assessment.cwl/read_quality", 
                    "in": [
                        {
                            "id": "#read_quality_assessment.cwl/read_quality/forward_reads", 
                            "source": [
                                "#read_quality_assessment.cwl/forward_reads"
                            ]
                        }, 
                        {
                            "id": "#read_quality_assessment.cwl/read_quality/reverse_reads", 
                            "source": [
                                "#read_quality_assessment.cwl/reverse_reads"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#read_quality_assessment.cwl/read_quality/fastqc_report_forward"
                        }, 
                        {
                            "id": "#read_quality_assessment.cwl/read_quality/fastqc_report_reverse"
                        }
                    ], 
                    "run": "#fastq-qc.cwl", 
                    "label": "fastQC version 0.11.5", 
                    "doc": "Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read."
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#read_quality_assessment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "variant_annotation", 
            "inputs": [
                {
                    "id": "#variant_annotation.cwl/normalized_g_vcf", 
                    "type": "File", 
                    "format": "edam:format_3016"
                }, 
                {
                    "id": "#variant_annotation.cwl/reference_assembly_2", 
                    "type": "File", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/File"
                }, 
                {
                    "id": "#variant_annotation.cwl/vep_cache", 
                    "type": "File", 
                    "format": "edam:format_3016"
                }
            ], 
            "outputs": [
                {
                    "id": "#variant_annotation.cwl/vep_annotated_vcf", 
                    "outputSource": "#variant_annotation.cwl/vcf_annotate_2/vep_annotated_vcf", 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#variant_annotation.cwl/vcf_annotate", 
                    "in": [
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate/input_vcf", 
                            "source": [
                                "#variant_annotation.cwl/normalized_g_vcf"
                            ]
                        }, 
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate/reference_assembly_2", 
                            "source": [
                                "#variant_annotation.cwl/reference_assembly_2"
                            ]
                        }, 
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate/vep_cache", 
                            "source": [
                                "#variant_annotation.cwl/vep_cache"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate/vep_annotated_vcf"
                        }
                    ], 
                    "run": "#vcf_annotate.cwl", 
                    "label": "vep version 85", 
                    "doc": "apply variant effect prediction tools and populate the vcf file."
                }, 
                {
                    "id": "#variant_annotation.cwl/vcf_annotate_2", 
                    "in": [
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate_2/input_vcf", 
                            "source": [
                                "#variant_annotation.cwl/vcf_annotate/vep_annotated_vcf"
                            ]
                        }, 
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate_2/reference_assembly_2", 
                            "source": [
                                "#variant_annotation.cwl/reference_assembly_2"
                            ]
                        }, 
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate_2/vep_cache", 
                            "source": [
                                "#variant_annotation.cwl/vep_cache"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#variant_annotation.cwl/vcf_annotate_2/vep_annotated_vcf"
                        }
                    ], 
                    "run": "#vcf_annotate.cwl", 
                    "label": "dbNSFP, grantham, condel plugin", 
                    "doc": "additional variant effect prediction scores"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#variant_annotation.cwl"
        }, 
        {
            "class": "Workflow", 
            "doc": "This is some documentation", 
            "label": "variant_calling", 
            "inputs": [
                {
                    "id": "#variant_calling.cwl/known_snp_sites", 
                    "type": "File", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ]
                }, 
                {
                    "id": "#variant_calling.cwl/recalibrated_bam", 
                    "type": "File"
                }, 
                {
                    "id": "#variant_calling.cwl/reference_assembly", 
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/scratch/drafts-cwl/cpipe-out-rabix/workflows/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ]
                }, 
                {
                    "id": "#variant_calling.cwl/target_sites", 
                    "type": "File", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "format": "edam:format_3003"
                }
            ], 
            "outputs": [
                {
                    "id": "#variant_calling.cwl/raw_variants_g_gvcf", 
                    "outputSource": "#variant_calling.cwl/genotypeGVCFs/raw_variants_g_gvcf", 
                    "type": "File"
                }
            ], 
            "steps": [
                {
                    "id": "#variant_calling.cwl/call_variants", 
                    "in": [
                        {
                            "id": "#variant_calling.cwl/call_variants/known_snp_sites", 
                            "source": [
                                "#variant_calling.cwl/known_snp_sites"
                            ]
                        }, 
                        {
                            "id": "#variant_calling.cwl/call_variants/recalibrated_bam", 
                            "source": [
                                "#variant_calling.cwl/recalibrated_bam"
                            ]
                        }, 
                        {
                            "id": "#variant_calling.cwl/call_variants/reference_assembly", 
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ]
                        }, 
                        {
                            "id": "#variant_calling.cwl/call_variants/target_sites", 
                            "source": [
                                "#variant_calling.cwl/target_sites"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#variant_calling.cwl/call_variants/raw_variants_vcf"
                        }
                    ], 
                    "run": "#call_variants.cwl", 
                    "label": "gatk-HaplotypeCaller version 3.6", 
                    "doc": "simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes."
                }, 
                {
                    "id": "#variant_calling.cwl/genotypeGVCFs", 
                    "in": [
                        {
                            "id": "#variant_calling.cwl/genotypeGVCFs/known_snp_sites", 
                            "source": [
                                "#variant_calling.cwl/known_snp_sites"
                            ]
                        }, 
                        {
                            "id": "#variant_calling.cwl/genotypeGVCFs/raw_variants_g", 
                            "source": [
                                "#variant_calling.cwl/call_variants/raw_variants_vcf"
                            ]
                        }, 
                        {
                            "id": "#variant_calling.cwl/genotypeGVCFs/reference_assembly", 
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ]
                        }
                    ], 
                    "out": [
                        {
                            "id": "#variant_calling.cwl/genotypeGVCFs/raw_variants_g_gvcf"
                        }
                    ], 
                    "run": "#genotypeGVCFs.cwl", 
                    "label": "gatk-genotypeGVCF version 3.6", 
                    "doc": "genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence."
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "id": "#variant_calling.cwl"
        }
    ]
}
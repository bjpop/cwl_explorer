{
    "cwlVersion": "v1.0", 
    "$graph": [
        {
            "class": "CommandLineTool", 
            "label": "mapping of forward and reverse reads to the reference assembly", 
            "doc": "http://bio-bwa.sourceforge.net/bwa.shtml", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Minimum seed length. INT. [19]", 
                    "inputBinding": {
                        "prefix": "-k"
                    }, 
                    "default": "", 
                    "id": "#align.cwl/MINIMUM_SEED_LENGTH"
                }, 
                {
                    "type": "string", 
                    "doc": "Reference library file name ['ucsc.hg19.fasta'].", 
                    "inputBinding": {
                        "prefix": "-R"
                    }, 
                    "default": "", 
                    "id": "#align.cwl/REFERENCE"
                }, 
                {
                    "type": "string", 
                    "doc": "Decoy reference genome ['NULL'].", 
                    "default": "", 
                    "id": "#align.cwl/decoy_ref"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1930", 
                    "doc": "Forward reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes", 
                    "id": "#align.cwl/forward_reads"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/data_2340", 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#align.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1930", 
                    "doc": "Reverse reads produced as a part of a paired-end sequencing experiment. Multiple file inputs when libraries are pooled across >1 lanes", 
                    "id": "#align.cwl/reverse_reads"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": "bam file containing aligned sequences.", 
                    "id": "#align.cwl/ref_aligned_bam"
                }
            ], 
            "baseCommand": [
                "bwa", 
                "mem"
            ], 
            "id": "#align.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "Apply recalibration to bam file. Overwrites values", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Perform base recalibration.", 
                    "inputBinding": {
                        "prefix": "-BQSR"
                    }, 
                    "default": "", 
                    "id": "#apply_bqsr.cwl/BQSR"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#apply_bqsr.cwl/deduped_realigned_bam"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": "Coordinates for regions discovered requiring realignment.", 
                    "id": "#apply_bqsr.cwl/recalibrated_table"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#apply_bqsr.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted.", 
                    "id": "#apply_bqsr.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#apply_bqsr.cwl/recalibrated_bam"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "PrintReads"
            ], 
            "id": "#apply_bqsr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "bam_quality - calculate coverage statistics", 
            "doc": "'https://github.com/arq5x/bedtools2'\n", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_006646"
                            ], 
                            "version": [
                                "2.25.0"
                            ], 
                            "package": "bedtools"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_XXXX", 
                    "doc": "Text file containing summaries of duplicate metrics.", 
                    "default": "", 
                    "id": "#bam_quality.cwl/dedup_metrics"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing the library sites.", 
                    "default": "", 
                    "id": "#bam_quality.cwl/gender"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing the library sites.", 
                    "default": "", 
                    "id": "#bam_quality.cwl/library_sites"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "default": "", 
                    "id": "#bam_quality.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_XXXX", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "default": "", 
                    "id": "#bam_quality.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted.", 
                    "default": "", 
                    "id": "#bam_quality.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/exome_coverage_gz"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": null, 
                    "id": "#bam_quality.cwl/fragments_tsv"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3003", 
                    "doc": null, 
                    "id": "#bam_quality.cwl/intersect_bed"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/intersect_cov_gz"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/karyotype_summary"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/ontarget_txt"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3003", 
                    "doc": null, 
                    "id": "#bam_quality.cwl/recalibrated_bed"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bam_quality.cwl/stage_report_pdf"
                }
            ], 
            "baseCommand": [
                "bedtools"
            ], 
            "id": "#bam_quality.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "Calculate recalibration values for base recalibration.", 
            "doc": "https://bio.tools/tool/gatk2_base_recalibrator-/version/none\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Reference library input name.", 
                    "inputBinding": {
                        "prefix": "-R"
                    }, 
                    "default": "", 
                    "id": "#bqsr.cwl/REFERENCE"
                }, 
                {
                    "type": "string", 
                    "doc": "Target interval site input.", 
                    "inputBinding": {
                        "prefix": "--targetIntervals"
                    }, 
                    "default": "", 
                    "id": "#bqsr.cwl/TARGETINTERVALS"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#bqsr.cwl/deduped_realigned_bam"
                }, 
                {
                    "type": "File", 
                    "format": "https://identifiers.org/rrid/RRID:SCR_002338", 
                    "doc": "dbsnp reference sites", 
                    "id": "#bqsr.cwl/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_XXXX", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#bqsr.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3003", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted.", 
                    "id": "#bqsr.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#bqsr.cwl/recalibrated_table"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "BaseRecalibrator"
            ], 
            "id": "#bqsr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "Call variants", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[25]", 
                    "inputBinding": {
                        "prefix": "--interval_padding"
                    }, 
                    "default": "", 
                    "id": "#call_variants.cwl/INTERVAL_PADDING"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "dbsnp reference sites", 
                    "inputBinding": {
                        "prefix": "--dbsnp"
                    }, 
                    "id": "#call_variants.cwl/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#call_variants.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_XXXX", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#call_variants.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3003", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted.", 
                    "id": "#call_variants.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#call_variants.cwl/raw_variants_vcf"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "HaplotypeCaller"
            ], 
            "id": "#call_variants.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "convert_table_lovd - for LOVD", 
            "doc": "", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "convert_to_lovd.py"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#convert_table_lovd.cwl/filtered_variant_table"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#convert_table_lovd.cwl/lovd_table"
                }
            ], 
            "baseCommand": [
                "convert_to_lovd.py"
            ], 
            "id": "#convert_table_lovd.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "Detect Variants workflow", 
            "doc": "WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe.", 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "doc": null, 
                    "id": "#main/annotations_indels_2"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#main/forward_reads"
                }, 
                {
                    "type": "File", 
                    "doc": null, 
                    "id": "#main/known_indel_sites"
                }, 
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#main/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates of exons downloaded from the UCSC database.", 
                    "id": "#main/library_sites"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#main/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "doc": "This is used by VEP.", 
                    "id": "#main/reference_assembly_2"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#main/reverse_reads"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#main/target_sites"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "database of annotations.", 
                    "id": "#main/vep_cache"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_forward", 
                    "doc": null, 
                    "id": "#main/fastqc_report_forward"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_reverse", 
                    "doc": null, 
                    "id": "#main/fastqc_report_reverse"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/insert_size_metrics_txt", 
                    "doc": null, 
                    "id": "#main/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/library_coverage_txt", 
                    "doc": null, 
                    "id": "#main/library_coverage_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/read_coverage_summary", 
                    "doc": null, 
                    "id": "#main/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/stage_report_pdf", 
                    "doc": null, 
                    "id": "#main/stage_report_pdf"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/post_annotation_processing/transcript_filtered_table", 
                    "doc": null, 
                    "id": "#main/transcript_filtered_table"
                }
            ], 
            "steps": [
                {
                    "run": "#generate_quality_reports.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/post_alignment_processing/dedup_metrics"
                            ], 
                            "id": "#main/generate_quality_reports/dedup_metrics"
                        }, 
                        {
                            "source": [
                                "#main/library_sites"
                            ], 
                            "id": "#main/generate_quality_reports/library_sites"
                        }, 
                        {
                            "source": "#main/post_alignment_processing/recalibrated_bam", 
                            "id": "#main/generate_quality_reports/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/generate_quality_reports/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/generate_quality_reports/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/generate_quality_reports/stage_report_pdf", 
                        "#main/generate_quality_reports/read_coverage_summary", 
                        "#main/generate_quality_reports/insert_size_metrics_txt", 
                        "#main/generate_quality_reports/library_coverage_txt"
                    ], 
                    "id": "#main/generate_quality_reports"
                }, 
                {
                    "run": "#post_alignment_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/read_alignment/aligned_merged_bam", 
                            "id": "#main/post_alignment_processing/aligned_merged_bam"
                        }, 
                        {
                            "source": [
                                "#main/known_indel_sites"
                            ], 
                            "id": "#main/post_alignment_processing/known_indel_sites"
                        }, 
                        {
                            "source": [
                                "#main/known_snp_sites"
                            ], 
                            "id": "#main/post_alignment_processing/known_snp_sites"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/post_alignment_processing/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/post_alignment_processing/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/post_alignment_processing/recalibrated_bam", 
                        "#main/post_alignment_processing/dedup_metrics"
                    ], 
                    "id": "#main/post_alignment_processing"
                }, 
                {
                    "run": "#post_annotation_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/variant_annotation/vep_annotated_vcf", 
                            "id": "#main/post_annotation_processing/annotated_vcf"
                        }
                    ], 
                    "out": [
                        "#main/post_annotation_processing/transcript_filtered_table"
                    ], 
                    "id": "#main/post_annotation_processing"
                }, 
                {
                    "run": "#post_variant_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/variant_calling/raw_variants_g_gvcf", 
                            "id": "#main/post_variant_processing/raw_variants_g_gvcf"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/post_variant_processing/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/post_variant_processing/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/post_variant_processing/normalized_g_vcf"
                    ], 
                    "id": "#main/post_variant_processing"
                }, 
                {
                    "run": "#read_alignment.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/forward_reads"
                            ], 
                            "id": "#main/read_alignment/forward_reads"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/read_alignment/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/reverse_reads"
                            ], 
                            "id": "#main/read_alignment/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#main/read_alignment/aligned_merged_bam"
                    ], 
                    "id": "#main/read_alignment"
                }, 
                {
                    "run": "#read_quality_assessment.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/forward_reads"
                            ], 
                            "id": "#main/read_quality_assessment/forward_reads"
                        }, 
                        {
                            "source": [
                                "#main/reverse_reads"
                            ], 
                            "id": "#main/read_quality_assessment/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#main/read_quality_assessment/fastqc_report_forward", 
                        "#main/read_quality_assessment/fastqc_report_reverse"
                    ], 
                    "id": "#main/read_quality_assessment"
                }, 
                {
                    "run": "#variant_annotation.cwl", 
                    "in": [
                        {
                            "source": "#main/post_variant_processing/normalized_g_vcf", 
                            "id": "#main/variant_annotation/normalized_g_vcf"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly_2"
                            ], 
                            "id": "#main/variant_annotation/reference_assembly_2"
                        }, 
                        {
                            "source": [
                                "#main/vep_cache"
                            ], 
                            "id": "#main/variant_annotation/vep_cache"
                        }
                    ], 
                    "out": [
                        "#main/variant_annotation/vep_annotated_vcf"
                    ], 
                    "id": "#main/variant_annotation"
                }, 
                {
                    "run": "#variant_calling.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/known_snp_sites"
                            ], 
                            "id": "#main/variant_calling/known_snp_sites"
                        }, 
                        {
                            "source": "#main/post_alignment_processing/recalibrated_bam", 
                            "id": "#main/variant_calling/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/variant_calling/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/variant_calling/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/variant_calling/raw_variants_g_gvcf"
                    ], 
                    "id": "#main/variant_calling"
                }
            ], 
            "id": "#main"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#fastqc.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#fastqc.cwl/forward_report_html"
                }, 
                {
                    "type": "File", 
                    "id": "#fastqc.cwl/reverse_report_html"
                }
            ], 
            "id": "#fastqc.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "filter_table - based on quality scores", 
            "doc": "", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "vcf_to_table.sh"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[2]", 
                    "inputBinding": {
                        "prefix": "--ad"
                    }, 
                    "default": "", 
                    "id": "#filter_table.cwl/AD"
                }, 
                {
                    "type": "string", 
                    "doc": "[0.15]", 
                    "inputBinding": {
                        "prefix": "--af"
                    }, 
                    "default": "", 
                    "id": "#filter_table.cwl/AF"
                }, 
                {
                    "type": "string", 
                    "doc": "[5]", 
                    "inputBinding": {
                        "prefix": "--dp"
                    }, 
                    "default": "", 
                    "id": "#filter_table.cwl/DP"
                }, 
                {
                    "type": "string", 
                    "doc": "[5]", 
                    "inputBinding": {
                        "prefix": "--qual"
                    }, 
                    "default": "", 
                    "id": "#filter_table.cwl/QUAL"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": null, 
                    "id": "#filter_table.cwl/variant_table_tsv"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#filter_table.cwl/filtered_variant_table"
                }
            ], 
            "baseCommand": [
                "filter_tsv.py"
            ], 
            "id": "#filter_table.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "generate_quality_reports", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/dedup_metrics"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates of library captures sites provided by the kit manufacturer.", 
                    "id": "#generate_quality_reports.cwl/library_sites"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_2572", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#generate_quality_reports.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/insert_size_metrics/insert_size_metrics_txt", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/insert_size_metrics/insert_size_metrics_txt", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/library_coverage_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/calculate_read_depth/read_coverage_summary", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/stage_report/stage_report_pdf", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/stage_report_pdf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#bam_quality.cwl", 
                    "label": "bedtools-coverageBed version xx", 
                    "in": [
                        {
                            "source": "#generate_quality_reports.cwl/create_target_exome_bed/intersect_bed", 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/intersect_bed"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/convert_bam_to_bed/recalibrated_bed", 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/library_sites"
                        }, 
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#generate_quality_reports.cwl/target_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/target_sites"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_coverage_stats/intersect_cov_gz", 
                        "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                        "#generate_quality_reports.cwl/calculate_coverage_stats/ontarget_txt"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_coverage_stats"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "samtools version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_qc_statistics/recalibrated_bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_qc_statistics/fragments_tsv"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_qc_statistics"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "gatk-depthOfCoverage version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_read_depth/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#generate_quality_reports.cwl/reference_assembly"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_read_depth/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_read_depth/read_coverage_summary"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_read_depth"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": null, 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/convert_bam_to_bed/recalibrated_bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/convert_bam_to_bed/recalibrated_bed"
                    ], 
                    "id": "#generate_quality_reports.cwl/convert_bam_to_bed"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "bedtools-intersect", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/library_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/create_target_exome_bed/library_sites"
                        }, 
                        {
                            "source": [
                                "#generate_quality_reports.cwl/target_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/create_target_exome_bed/target_sites"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/create_target_exome_bed/intersect_bed"
                    ], 
                    "id": "#generate_quality_reports.cwl/create_target_exome_bed"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "check_karyotype.py updated XX", 
                    "in": [
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                            "id": "#generate_quality_reports.cwl/gender_check/exome_coverage_gz"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/gender_check/karyotype_summary"
                    ], 
                    "id": "#generate_quality_reports.cwl/gender_check"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "picard-collectInsertSizeMetrics version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/insert_size_metrics/recalibrated_bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/insert_size_metrics/insert_size_metrics_txt"
                    ], 
                    "id": "#generate_quality_reports.cwl/insert_size_metrics"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "qc_report.py version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/dedup_metrics"
                            ], 
                            "id": "#generate_quality_reports.cwl/stage_report/dedup_metrics"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                            "id": "#generate_quality_reports.cwl/stage_report/exome_coverage"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_qc_statistics/fragments_tsv", 
                            "id": "#generate_quality_reports.cwl/stage_report/fragments_tsv"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/gender_check/karyotype_summary", 
                            "id": "#generate_quality_reports.cwl/stage_report/gender"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/intersect_cov_gz", 
                            "id": "#generate_quality_reports.cwl/stage_report/intersect_cov_gz"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/ontarget_txt", 
                            "id": "#generate_quality_reports.cwl/stage_report/ontarget_coverage"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/stage_report/stage_report_pdf", 
                        "#generate_quality_reports.cwl/stage_report/read_coverage_summary"
                    ], 
                    "id": "#generate_quality_reports.cwl/stage_report"
                }
            ], 
            "id": "#generate_quality_reports.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "sort bam files. Genomic coordinates is set as the default", 
            "doc": "http://www.htslib.org/doc/samtools.html\n", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [
                                "https://identifiers.org/rrid/RRID:SCR_002105"
                            ], 
                            "version": [
                                "1.3"
                            ], 
                            "package": "samtools"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Description of purpose. string. [NULL]", 
                    "inputBinding": {
                        "prefix": "-n"
                    }, 
                    "default": "", 
                    "id": "#genomic_coord_sort.cwl/SORT_BY_READ_NAMES"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": "bam files. May be multiple bams if individual sequenced over numerous lanes.", 
                    "id": "#genomic_coord_sort.cwl/bam"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": "sorted and aligned bam file.", 
                    "id": "#genomic_coord_sort.cwl/sorted_bam"
                }
            ], 
            "baseCommand": [
                "samtools", 
                "sort"
            ], 
            "id": "#genomic_coord_sort.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "genotype GVCF", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[5.0]", 
                    "inputBinding": {
                        "prefix": "--stand_call_conf"
                    }, 
                    "default": "", 
                    "id": "#genotypeGVCFs.cwl/STAND_CALL_CONF"
                }, 
                {
                    "type": "string", 
                    "doc": "[5.0]", 
                    "inputBinding": {
                        "prefix": "--stand_emit_conf"
                    }, 
                    "default": "", 
                    "id": "#genotypeGVCFs.cwl/STAND_EMIT_CONF"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": "dbsnp sites", 
                    "inputBinding": {
                        "prefix": "--dbsnp"
                    }, 
                    "default": "", 
                    "id": "#genotypeGVCFs.cwl/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#genotypeGVCFs.cwl/raw_variants_g"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#genotypeGVCFs.cwl/reference_assembly"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#genotypeGVCFs.cwl/raw_variants_g_gvcf"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "GenotypeGVCFs"
            ], 
            "id": "#genotypeGVCFs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "identify and mark pcr duplicates.", 
            "doc": "http://picard.sourceforge.net\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Description of purpose. boolean [true]", 
                    "default": "", 
                    "id": "#mark_duplicates.cwl/CREATE_INDEX"
                }, 
                {
                    "type": "string", 
                    "doc": "Description of purpose. boolean [true]", 
                    "default": "", 
                    "id": "#mark_duplicates.cwl/REMOVE_DUPLICATES"
                }, 
                {
                    "type": "string", 
                    "doc": "Description of purpose. string [LENIENT]", 
                    "default": "", 
                    "id": "#mark_duplicates.cwl/VALIDATION_STRINGENCY"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#mark_duplicates.cwl/sorted_aligned_bam"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": "Text file containing summaries of duplicate metrics.", 
                    "id": "#mark_duplicates.cwl/dedup_metrics"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": "Deduped, merged and sorted bam file.", 
                    "id": "#mark_duplicates.cwl/deduped_bam"
                }
            ], 
            "baseCommand": [
                "picard.jar", 
                "Markduplicates"
            ], 
            "id": "#mark_duplicates.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "merge bam files", 
            "doc": "http://bio-bwa.sourceforge.net/bwa.shtml\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Description of purpose. boolean [true]", 
                    "default": "", 
                    "id": "#merge_alignments.cwl/ASSUME_SORTED"
                }, 
                {
                    "type": "string", 
                    "doc": "Description of purpose. boolean [true]", 
                    "default": "", 
                    "id": "#merge_alignments.cwl/CREATE_INDEX"
                }, 
                {
                    "type": "string", 
                    "doc": "Description of purpose. string [LENIENT]", 
                    "default": "", 
                    "id": "#merge_alignments.cwl/VALIDATION_STRINGENCY"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "Merge of bam files if multiple bams due to an individual being sequenced over several lanes.", 
                    "id": "#merge_alignments.cwl/bam"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": "Merged and sorted bam file.", 
                    "id": "#merge_alignments.cwl/aligned_merged_bam"
                }
            ], 
            "baseCommand": [
                "picard.jar", 
                "MergeSamFiles"
            ], 
            "id": "#merge_alignments.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "merge variants", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#merge_variants.cwl/indel_g_gvcf"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#merge_variants.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#merge_variants.cwl/snv_g_gvcf"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#merge_variants.cwl/merged_variants_vcf"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "CombineVariants"
            ], 
            "id": "#merge_variants.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "perform local realignment of indel sites.", 
            "doc": "https://bio.tools/tool/gatk2_indel_realigner-IP/version/none\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "Target interval site input.", 
                    "inputBinding": {
                        "prefix": "--targetIntervals"
                    }, 
                    "default": "", 
                    "id": "#perform_realignment.cwl/TARGET_INTERVALS"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#perform_realignment.cwl/deduped_bam"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": "Coordinates for regions discovered requiring realignment.", 
                    "id": "#perform_realignment.cwl/interval_list"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/data_2340", 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "inputBinding": null, 
                    "id": "#perform_realignment.cwl/reference_assembly"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#perform_realignment.cwl/deduped_realigned_bam"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "IndelRealigner"
            ], 
            "id": "#perform_realignment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_alignment_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/aligned_merged_bam"
                }, 
                {
                    "type": "File", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/known_indel_sites"
                }, 
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#post_alignment_processing.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_alignment_processing.cwl/mark_duplicates/dedup_metrics", 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/dedup_metrics"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam", 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/recalibrated_bam"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#apply_bqsr.cwl", 
                    "label": "gatk-printReads version 3.6", 
                    "doc": "overwrite quality scores with re-calibrated values.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam", 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/deduped_realigned_bam"
                        }, 
                        {
                            "source": "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table", 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_table"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/target_sites"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/apply_recalibration"
                }, 
                {
                    "run": "#bqsr.cwl", 
                    "label": "gatk-baseRecalibrator version 3.6", 
                    "doc": "recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam", 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/deduped_realigned_bam"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/known_snp_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/known_snp_sites"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/target_sites"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table"
                    ], 
                    "id": "#post_alignment_processing.cwl/base_quality_recalibration"
                }, 
                {
                    "run": "#genomic_coord_sort.cwl", 
                    "label": "samtools version 1.3", 
                    "in": [
                        {
                            "source": [
                                "#post_alignment_processing.cwl/aligned_merged_bam"
                            ], 
                            "id": "#post_alignment_processing.cwl/genomic_coord_sort/bam"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/genomic_coord_sort/sorted_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/genomic_coord_sort"
                }, 
                {
                    "run": "#mark_duplicates.cwl", 
                    "label": "picard-markDuplicates", 
                    "doc": "identify pcr duplicates and mark.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/genomic_coord_sort/sorted_bam", 
                            "id": "#post_alignment_processing.cwl/mark_duplicates/sorted_aligned_bam"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                        "#post_alignment_processing.cwl/mark_duplicates/dedup_metrics"
                    ], 
                    "id": "#post_alignment_processing.cwl/mark_duplicates"
                }, 
                {
                    "run": "#perform_realignment.cwl", 
                    "label": "gatk-IndelRealigner version 3.6", 
                    "doc": "perform realignment and generate new vcf with updated coords.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                            "id": "#post_alignment_processing.cwl/perform_realignment/deduped_bam"
                        }, 
                        {
                            "source": "#post_alignment_processing.cwl/realign_intervals/realigned_intervals", 
                            "id": "#post_alignment_processing.cwl/perform_realignment/interval_list"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/perform_realignment/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/perform_realignment/deduped_realigned_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/perform_realignment"
                }, 
                {
                    "run": "#realign_intervals.cwl", 
                    "label": "gatk-RealignerTargetCreator version 3.6", 
                    "doc": "identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                            "id": "#post_alignment_processing.cwl/realign_intervals/deduped_bam"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/known_indel_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/known_indel_sites"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/target_sites"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/realign_intervals/realigned_intervals"
                    ], 
                    "id": "#post_alignment_processing.cwl/realign_intervals"
                }
            ], 
            "id": "#post_alignment_processing.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "post_annotate_vep", 
            "doc": "", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "filter_vep_pl"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[BIOTYPE match protein_coding]", 
                    "inputBinding": {
                        "prefix": "--filter"
                    }, 
                    "default": "", 
                    "id": "#post_annotate_vep.cwl/BIOTYPE"
                }, 
                {
                    "type": "string", 
                    "doc": "[Consequence not matches stream]", 
                    "inputBinding": {
                        "prefix": "--filter"
                    }, 
                    "default": "", 
                    "id": "#post_annotate_vep.cwl/CONSEQUENCE"
                }, 
                {
                    "type": "string", 
                    "doc": "[Feature]", 
                    "inputBinding": {
                        "prefix": "--filter"
                    }, 
                    "default": "", 
                    "id": "#post_annotate_vep.cwl/FEATURE"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016# vcf", 
                    "doc": null, 
                    "id": "#post_annotate_vep.cwl/annotated_vcf"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#post_annotate_vep.cwl/post_anno_vcf"
                }
            ], 
            "baseCommand": [
                "filter_vep.pl"
            ], 
            "id": "#post_annotate_vep.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_annotation_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#post_annotation_processing.cwl/annotated_vcf"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table", 
                    "doc": null, 
                    "id": "#post_annotation_processing.cwl/transcript_filtered_table"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#convert_table_lovd.cwl", 
                    "label": "filter_lovd.py", 
                    "doc": "Expand VEP annotations across columns.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/filter_table/filtered_variant_table", 
                            "id": "#post_annotation_processing.cwl/covert_table_lovd/filtered_variant_table"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/covert_table_lovd/lovd_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/covert_table_lovd"
                }, 
                {
                    "run": "#filter_table.cwl", 
                    "label": "filter.py", 
                    "doc": "filter low quality variant (marked in vcf not removed).", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv", 
                            "id": "#post_annotation_processing.cwl/filter_table/variant_table_tsv"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/filter_table/filtered_variant_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/filter_table"
                }, 
                {
                    "run": "#post_annotate_vep.cwl", 
                    "label": "vep-filter_vep.pl", 
                    "doc": "discard variants outside of non-coding regions. Filter based on consequence and biotype fields. Filtering performed to satisfy LOVD requirements.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/annotated_vcf", 
                            "id": "#post_annotation_processing.cwl/post_annotate_vep/annotated_vcf"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/post_annotate_vep/post_anno_vcf"
                    ], 
                    "id": "#post_annotation_processing.cwl/post_annotate_vep"
                }, 
                {
                    "run": "#transcript_filter.cwl", 
                    "label": "filter.py updated XX", 
                    "doc": "prioritise in cases where multiple transcripts for LOVD.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/covert_table_lovd/lovd_table", 
                            "id": "#post_annotation_processing.cwl/transcript_filter/lovd_table"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/transcript_filter"
                }, 
                {
                    "run": "#vcf_to_table.cwl", 
                    "label": "vcf_to_table.py", 
                    "doc": "convert vcf to table to satisfy formatting requirements for LOVD import.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/post_annotate_vep/post_anno_vcf", 
                            "id": "#post_annotation_processing.cwl/vcf_to_table/post_anno_vcf"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv"
                    ], 
                    "id": "#post_annotation_processing.cwl/vcf_to_table"
                }
            ], 
            "id": "#post_annotation_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_variant_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/raw_variants_g_gvcf"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#post_variant_processing.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_variant_processing.cwl/vcf_normalize/normalized_g_vcf", 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/normalized_g_vcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#merge_variants.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "merge filtered indel and snv vcfs", 
                    "in": [
                        {
                            "source": "#post_variant_processing.cwl/select_indels/indel_g_gvcf", 
                            "id": "#post_variant_processing.cwl/merge_variants/indel_g_gvcf"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/merge_variants/reference_assembly"
                        }, 
                        {
                            "source": "#post_variant_processing.cwl/select_snvs/snv_g_gvcf", 
                            "id": "#post_variant_processing.cwl/merge_variants/snv_g_gvcf"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/merge_variants/merged_variants_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/merge_variants"
                }, 
                {
                    "run": "#select_indels.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract indel mutations only. This is necessary so that indel-specific filters can be applied.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_g_gvcf"
                            ], 
                            "id": "#post_variant_processing.cwl/select_indels/raw_variants_g_gvcf"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/select_indels/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/select_indels/indel_g_gvcf"
                    ], 
                    "id": "#post_variant_processing.cwl/select_indels"
                }, 
                {
                    "run": "#select_snvs.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract all but indel mutations types so that hard filters can be applied.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_g_gvcf"
                            ], 
                            "id": "#post_variant_processing.cwl/select_snvs/raw_variants_g_gvcf"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/select_snvs/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/select_snvs/snv_g_gvcf"
                    ], 
                    "id": "#post_variant_processing.cwl/select_snvs"
                }, 
                {
                    "run": "#vcf_normalize.cwl", 
                    "label": "bcftools version 1.3", 
                    "doc": "normalisation and split multi-allelic sites", 
                    "in": [
                        {
                            "source": "#post_variant_processing.cwl/merge_variants/merged_variants_vcf", 
                            "id": "#post_variant_processing.cwl/vcf_normalize/merged_variants_vcf"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/vcf_normalize/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/vcf_normalize/normalized_g_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/vcf_normalize"
                }
            ], 
            "id": "#post_variant_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_alignment", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/forward_reads"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#read_alignment.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/reverse_reads"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#read_alignment.cwl/merge_alignments/aligned_merged_bam", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/aligned_merged_bam"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#align.cwl", 
                    "label": "bwa-mem version 0.7.13", 
                    "doc": "align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.", 
                    "in": [
                        {
                            "source": [
                                "#read_alignment.cwl/forward_reads"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/forward_reads"
                        }, 
                        {
                            "source": [
                                "#read_alignment.cwl/reference_assembly"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#read_alignment.cwl/reverse_reads"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#read_alignment.cwl/align_to_ref/ref_aligned_bam"
                    ], 
                    "id": "#read_alignment.cwl/align_to_ref"
                }, 
                {
                    "run": "#merge_alignments.cwl", 
                    "label": "picard-mergSamFiles v2.6.0", 
                    "doc": "merge individual alignments representing sequencing lanes.", 
                    "in": [
                        {
                            "source": "#read_alignment.cwl/align_to_ref/ref_aligned_bam", 
                            "id": "#read_alignment.cwl/merge_alignments/bam"
                        }
                    ], 
                    "out": [
                        "#read_alignment.cwl/merge_alignments/aligned_merged_bam"
                    ], 
                    "id": "#read_alignment.cwl/merge_alignments"
                }
            ], 
            "id": "#read_alignment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_quality_assessment", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/forward_reads"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/reverse_reads"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#read_quality_assessment.cwl/read_quality/forward_report_html", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/fastqc_report_forward"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#read_quality_assessment.cwl/read_quality/reverse_report_html", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/fastqc_report_reverse"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#fastqc.cwl", 
                    "label": "fastQC version 0.11.5", 
                    "doc": "Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.", 
                    "in": [
                        {
                            "source": [
                                "#read_quality_assessment.cwl/forward_reads"
                            ], 
                            "id": "#read_quality_assessment.cwl/read_quality/forward_reads"
                        }, 
                        {
                            "source": [
                                "#read_quality_assessment.cwl/reverse_reads"
                            ], 
                            "id": "#read_quality_assessment.cwl/read_quality/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#read_quality_assessment.cwl/read_quality/forward_report_html", 
                        "#read_quality_assessment.cwl/read_quality/reverse_report_html"
                    ], 
                    "id": "#read_quality_assessment.cwl/read_quality"
                }
            ], 
            "id": "#read_quality_assessment.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "discover indel sites in need of realignment.", 
            "doc": "https://bio.tools/tool/gatk2_realigner_target_c/version/none\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": ". INT [25]", 
                    "inputBinding": {
                        "prefix": "--interval_padding"
                    }, 
                    "default": "", 
                    "id": "#realign_intervals.cwl/INTERVAL_PADDING"
                }, 
                {
                    "type": "string", 
                    "format": null, 
                    "doc": "Description of purpose. VCF file", 
                    "inputBinding": {
                        "prefix": "--known"
                    }, 
                    "default": "", 
                    "id": "#realign_intervals.cwl/KNOWN_SITES"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_2572", 
                    "doc": null, 
                    "id": "#realign_intervals.cwl/deduped_bam"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "Mills & 1000G reference indels", 
                    "id": "#realign_intervals.cwl/known_indel_sites"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/data_2340", 
                    "doc": "hg19 human reference genome", 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#realign_intervals.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3003", 
                    "doc": "bed file containing the coordinates for genes/regions to be targeted.", 
                    "id": "#realign_intervals.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": "Coordinates for regions discovered requiring realignment.", 
                    "id": "#realign_intervals.cwl/realigned_intervals"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "RealignerTargetCreator"
            ], 
            "id": "#realign_intervals.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "select variants - indel", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[25]", 
                    "inputBinding": {
                        "prefix": "--interval_padding"
                    }, 
                    "default": "", 
                    "id": "#select_indels.cwl/INTERVAL_PADDING"
                }, 
                {
                    "type": "string", 
                    "doc": "[INDEL]", 
                    "inputBinding": {
                        "prefix": "--selectTypeToInclude"
                    }, 
                    "default": "", 
                    "id": "#select_indels.cwl/SELECTTYPETOINCLUDE"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016# vcf", 
                    "doc": null, 
                    "id": "#select_indels.cwl/raw_variants_g_gvcf"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#select_indels.cwl/reference_assembly"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#select_indels.cwl/indel_g_gvcf"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "SelectVariants"
            ], 
            "id": "#select_indels.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "select variants - snvs", 
            "doc": "", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[10]", 
                    "inputBinding": {
                        "position": null, 
                        "prefix": "--interval_padding"
                    }, 
                    "default": "", 
                    "id": "#select_snvs.cwl/INTERVAL_PADDING"
                }, 
                {
                    "type": "string", 
                    "doc": "[SNP, MIXED, MNP, SYMBOLIC, NO VARIATION]", 
                    "inputBinding": {
                        "position": null, 
                        "prefix": "--selectTypeToInclude"
                    }, 
                    "default": "", 
                    "id": "#select_snvs.cwl/SELECTTYPETOINCLUDE"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#select_snvs.cwl/raw_variants_g_gvcf"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#select_snvs.cwl/reference_assembly"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#select_snvs.cwl/snv_g_gvcf"
                }
            ], 
            "baseCommand": [
                "GenomeAnalysisTK.jar", 
                "SelectVariants"
            ], 
            "id": "#select_snvs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "transcript_filter - remove multiple transcripts", 
            "doc": "", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "filter_transcripts.py"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#transcript_filter.cwl/lovd_table"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#transcript_filter.cwl/transcript_filtered_table"
                }
            ], 
            "baseCommand": [
                "filter_transcripts.py"
            ], 
            "id": "#transcript_filter.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "variant_annotation", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/normalized_g_vcf"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/reference_assembly_2"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/vep_cache"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#variant_annotation.cwl/vcf_annotate_2/vep_annotated_vcf", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/vep_annotated_vcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#vcf_annotate.cwl", 
                    "label": "vep version 85", 
                    "doc": "apply variant effect prediction tools and populate the vcf file.", 
                    "in": [
                        {
                            "source": "#variant_annotation.cwl/normalized_g_vcf", 
                            "id": "#variant_annotation.cwl/vcf_annotate/input_vcf"
                        }, 
                        {
                            "source": [
                                "#variant_annotation.cwl/reference_assembly_2"
                            ], 
                            "id": "#variant_annotation.cwl/vcf_annotate/reference_assembly_2"
                        }, 
                        {
                            "source": [
                                "#variant_annotation.cwl/vep_cache"
                            ], 
                            "id": "#variant_annotation.cwl/vcf_annotate/vep_cache"
                        }
                    ], 
                    "out": [
                        "#variant_annotation.cwl/vcf_annotate/vep_annotated_vcf"
                    ], 
                    "id": "#variant_annotation.cwl/vcf_annotate"
                }, 
                {
                    "run": "#vcf_annotate.cwl", 
                    "label": "dbNSFP, grantham, condel plugin", 
                    "doc": "additional variant effect prediction scores", 
                    "in": [
                        {
                            "source": "#variant_annotation.cwl/vcf_annotate/vep_annotated_vcf", 
                            "id": "#variant_annotation.cwl/vcf_annotate_2/input_vcf"
                        }, 
                        {
                            "source": [
                                "#variant_annotation.cwl/reference_assembly_2"
                            ], 
                            "id": "#variant_annotation.cwl/vcf_annotate_2/reference_assembly_2"
                        }, 
                        {
                            "source": [
                                "#variant_annotation.cwl/vep_cache"
                            ], 
                            "id": "#variant_annotation.cwl/vcf_annotate_2/vep_cache"
                        }
                    ], 
                    "out": [
                        "#variant_annotation.cwl/vcf_annotate_2/vep_annotated_vcf"
                    ], 
                    "id": "#variant_annotation.cwl/vcf_annotate_2"
                }
            ], 
            "id": "#variant_annotation.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "variant_calling", 
            "doc": "This is some documentation", 
            "inputs": [
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#variant_calling.cwl/known_snp_sites"
                }, 
                {
                    "type": "File", 
                    "id": "#variant_calling.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#variant_calling.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#variant_calling.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#variant_calling.cwl/genotypeGVCFs/raw_variants_g_gvcf", 
                    "doc": null, 
                    "id": "#variant_calling.cwl/raw_variants_g_gvcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#call_variants.cwl", 
                    "label": "gatk-HaplotypeCaller version 3.6", 
                    "doc": "simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.", 
                    "in": [
                        {
                            "source": [
                                "#variant_calling.cwl/known_snp_sites"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/known_snp_sites"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/recalibrated_bam"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/target_sites"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/target_sites"
                        }
                    ], 
                    "out": [
                        "#variant_calling.cwl/call_variants/raw_variants_vcf"
                    ], 
                    "id": "#variant_calling.cwl/call_variants"
                }, 
                {
                    "run": "#genotypeGVCFs.cwl", 
                    "label": "gatk-genotypeGVCF version 3.6", 
                    "doc": "genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.", 
                    "in": [
                        {
                            "source": [
                                "#variant_calling.cwl/known_snp_sites"
                            ], 
                            "id": "#variant_calling.cwl/genotypeGVCFs/known_snp_sites"
                        }, 
                        {
                            "source": "#variant_calling.cwl/call_variants/raw_variants_vcf", 
                            "id": "#variant_calling.cwl/genotypeGVCFs/raw_variants_g"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ], 
                            "id": "#variant_calling.cwl/genotypeGVCFs/reference_assembly"
                        }
                    ], 
                    "out": [
                        "#variant_calling.cwl/genotypeGVCFs/raw_variants_g_gvcf"
                    ], 
                    "id": "#variant_calling.cwl/genotypeGVCFs"
                }
            ], 
            "id": "#variant_calling.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "vcf annotate", 
            "doc": "\"http://www.ensembl.org/info/docs/tools/vep/index.html\"\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "[Grantham]", 
                    "inputBinding": {
                        "prefix": "--plugin"
                    }, 
                    "default": "", 
                    "id": "#vcf_annotate.cwl/Grantham_plugin"
                }, 
                {
                    "type": "string", 
                    "doc": "[Condel]", 
                    "inputBinding": {
                        "prefix": "--plugin"
                    }, 
                    "default": "", 
                    "id": "#vcf_annotate.cwl/condel_plugin"
                }, 
                {
                    "type": "string", 
                    "doc": "[dbNSFP]", 
                    "inputBinding": {
                        "prefix": "--plugin"
                    }, 
                    "default": "", 
                    "id": "#vcf_annotate.cwl/dbNSFP"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#vcf_annotate.cwl/input_vcf"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": "Homo_sapiens.GRCh37.75.dna.primary_assembly.fa from VEP cache", 
                    "id": "#vcf_annotate.cwl/reference_assembly_2"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#vcf_annotate.cwl/vep_cache"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#vcf_annotate.cwl/vep_annotated_vcf"
                }
            ], 
            "baseCommand": [
                "variant_effect_predictor.pl"
            ], 
            "id": "#vcf_annotate.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "vcf normalize", 
            "doc": "http://samtools.sourceforge.net/mpileup.shtml\n", 
            "hints": [
                {
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
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#vcf_normalize.cwl/merged_variants_vcf"
                }, 
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_1929", 
                    "doc": null, 
                    "secondaryFiles": [
                        ".fai", 
                        ".bwt", 
                        ".sa", 
                        ".ann", 
                        ".amb", 
                        ".pac", 
                        ".alt"
                    ], 
                    "id": "#vcf_normalize.cwl/reference_assembly"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#vcf_normalize.cwl/normalized_g_vcf"
                }
            ], 
            "baseCommand": [
                "bcftools", 
                "norm"
            ], 
            "id": "#vcf_normalize.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "label": "vcf_to_table filter", 
            "doc": "", 
            "hints": [
                {
                    "packages": [
                        {
                            "specs": [], 
                            "version": [
                                ""
                            ], 
                            "package": "vcf_to_table.sh"
                        }
                    ], 
                    "class": "SoftwareRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3016", 
                    "doc": null, 
                    "id": "#vcf_to_table.cwl/post_anno_vcf"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "format": "http://edamontology.org/format_3475", 
                    "doc": null, 
                    "id": "#vcf_to_table.cwl/variant_table_tsv"
                }
            ], 
            "baseCommand": [
                "vcf_to_table.sh"
            ], 
            "id": "#vcf_to_table.cwl"
        }
    ]
}
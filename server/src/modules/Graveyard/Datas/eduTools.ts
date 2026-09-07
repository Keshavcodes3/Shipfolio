export const eduToolsFailed = [
    {
        "id": "courseforge",
        "name": "CourseForge",
        "slug": "courseforge",
        "classification": {
            "primary_category": "education",
            "secondary_categories": [
                "edtech",
                "learning-platform",
                "online-courses",
                "creator-education"
            ],
            "business_type": "saas",
            "status": "failed",
            "failure_type": "creator_acquisition"
        },
        "overview": {
            "one_liner": "A platform that helped experts turn their knowledge into structured online courses.",
            "problem": "Subject-matter experts wanted to teach online but lacked the technical tools and instructional structure required to create professional courses.",
            "target_users": [
                "independent_educators",
                "subject_matter_experts",
                "online_creators",
                "coaches"
            ],
            "product": "CourseForge provided tools for creating, organizing, publishing, and selling structured online courses."
        },
        "idea": {
            "what_they_wanted_to_build": "A creator-first learning platform that allowed experts to transform their existing knowledge into paid online courses without needing to build their own technology.",
            "why_the_problem_mattered": "Many experts had valuable knowledge but struggled with course structure, video hosting, payments, student management, and content organization.",
            "founder_hypothesis": "Experts would pay recurring fees for a simpler alternative to building and maintaining their own education infrastructure.",
            "initial_assumption": "A large population of experts wanted to monetize their knowledge and would actively seek specialized course-building software."
        },
        "why_they_wanted_to_build_it": {
            "motivation": "The product was motivated by the growing creator economy and the increasing demand for independent online education.",
            "founder_observation": "Experts were frequently using combinations of video hosting, payment processors, document tools, and community platforms to deliver courses.",
            "important_context": "The founders believed consolidating these workflows into one product would create enough value to support recurring SaaS revenue.",
            "lesson": "Fragmented workflows do not necessarily mean customers want another all-in-one platform."
        },
        "product": {
            "type": "saas",
            "delivery": "web_platform",
            "core_use_case": "online_course_creation_and_delivery",
            "primary_user": "independent_educators",
            "secondary_user": "online_creators",
            "technical_implementation": null,
            "pricing_model": "subscription",
            "integrations": null
        },
        "building": {
            "development_period": "approximately_18_months",
            "team_size": 3,
            "development_method": "iterative_product_development",
            "technology_stack": null,
            "distribution_strategy": "creator_outreach_and_content_marketing",
            "initial_strategy": "Build a complete course creation and hosting platform for independent educators.",
            "important_decision": "The team prioritized building a broad set of course-management features before establishing a repeatable acquisition channel."
        },
        "validation": {
            "approach": [
                "Interviewed potential educators",
                "Built an early course-authoring prototype",
                "Released a public beta",
                "Attempted creator-focused outbound acquisition"
            ],
            "critical_problem": "Interest in the concept did not translate into enough creators consistently publishing and selling courses.",
            "validation_failure": "The team discovered that many potential users liked the product but were unwilling to invest the time required to migrate their existing content and build a complete course.",
            "key_realization": "Creator interest is not equivalent to creator activation."
        },
        "traction": {
            "users": null,
            "revenue": null,
            "monthly_recurring_revenue": null,
            "growth_rate": null,
            "retention": null,
            "funding": null,
            "investors": [],
            "customers": null,
            "product_market_fit": false
        },
        "go_to_market": {
            "primary_channel": "creator_outreach",
            "sales_motion": "self_serve",
            "target_market": "independent_online_educators",
            "distribution_challenge": "The platform needed creators to invest significant effort before they could generate value from it.",
            "important_lesson": "Products requiring customers to migrate substantial content face a much higher activation barrier."
        },
        "failure": {
            "status": "shutdown",
            "primary_reason": "creator_acquisition",
            "why_failed": "The product attracted interest but failed to establish a sufficiently large and active base of creators who consistently published courses.",
            "contributing_factors": [
                {
                    "factor": "High activation cost",
                    "explanation": "Creators had to spend significant time organizing existing knowledge before seeing meaningful value."
                },
                {
                    "factor": "Creator acquisition challenge",
                    "explanation": "Reaching enough qualified educators required substantial outbound and content-marketing effort."
                },
                {
                    "factor": "Crowded market",
                    "explanation": "Creators already had access to established course-hosting and creator-commerce platforms."
                }
            ],
            "death_event": "The founders stopped investing in the platform after failing to establish repeatable creator acquisition.",
            "what_did_not_work": [
                "Building a broad creator platform before proving acquisition",
                "Assuming experts would naturally migrate existing course material",
                "Relying primarily on creator interest as evidence of demand"
            ]
        },
        "founder_realization": {
            "biggest_realization": "A creator platform needs to solve the creator's distribution problem, not only the creator's publishing problem.",
            "before": "The primary obstacle appeared to be the technical difficulty of creating and hosting courses.",
            "after": "The larger obstacle was convincing creators to invest time in creating courses and helping them acquire students.",
            "core_insight": "Helping someone create a product is less valuable if you do not help them find customers for it."
        },
        "lessons": [
            {
                "title": "Validate activation",
                "lesson": "Measure whether users actually complete the critical setup step rather than merely expressing interest.",
                "why_it_matters": "A learning platform can have strong sign-up numbers while having almost no active educators."
            },
            {
                "title": "Distribution is part of the product",
                "lesson": "Creator platforms should consider how creators will acquire learners before building extensive publishing infrastructure.",
                "why_it_matters": "Creators care about revenue and audience growth, not simply the ability to upload content."
            },
            {
                "title": "Migration creates friction",
                "lesson": "Moving existing content into a new platform can be a much larger barrier than expected.",
                "why_it_matters": "Every additional setup step reduces the percentage of users who reach the value-producing action."
            }
        ],
        "graveyard_analysis": {
            "failure_pattern": [
                "Large creator opportunity identified",
                "Course-building platform developed",
                "Initial creator interest generated",
                "Activation remained weak",
                "Creator acquisition became expensive",
                "Platform failed to reach sustainable scale",
                "Shutdown"
            ],
            "the_illusion": "Thousands of experts appeared to have knowledge they could monetize online.",
            "the_reality": "Only a small subset were willing to consistently create courses, market them, and pay for infrastructure.",
            "what_a_founder_should_check_earlier": [
                "How many potential creators will actually publish?",
                "How long does activation take?",
                "Will creators migrate existing content?",
                "Who brings the students?",
                "What happens if creators cannot sell their first course?",
                "What is the realistic creator acquisition cost?"
            ]
        },
        "counterfactual": {
            "what_might_have_helped": [
                "Start with a narrow creator niche.",
                "Provide distribution and student acquisition alongside course hosting.",
                "Validate creator activation before building the complete platform.",
                "Offer concierge course migration for early customers."
            ],
            "note": "These are post-mortem interpretations for the synthetic case and are not claims about a real company."
        },
        "data_quality": {
            "known": [
                "Product concept",
                "Target customer",
                "Intended business model",
                "Synthetic failure scenario"
            ],
            "unknown": [
                "Actual revenue",
                "Actual user count",
                "Actual funding",
                "Actual technology stack",
                "Actual retention",
                "Actual founder identity"
            ],
            "fabrication_policy": "Synthetic startup concept created for educational research and product prototyping. It is not a factual claim about a real company."
        },
        "sources": [],
        "graveyard_card": {
            "headline": "Building the course platform was easier than getting creators to actually use it.",
            "failure_reason": "Creator acquisition",
            "biggest_lesson": "Validate activation and distribution before building a large creator platform.",
            "difficulty": "medium",
            "founder_stage": "early_stage",
            "worth_studying": true
        }
    }
]
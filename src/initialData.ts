import { UserProfile, JobOpportunity, McpAgentTrace, NotificationItem, ScoutConfig } from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  resumeText: `Alex Chen
Senior AI & Automation Systems Engineer
Bengaluru, KA, India | alex.chen.ai@example.com

SUMMARY
Senior AI & Automation Engineer with 7+ years of experience architecting and deploying large-scale neural network pipelines, LLM agent orchestrations, distributed inference serving (vLLM, TensorRT-LLM), and real-time MLOps infrastructure across technology hubs in India and global remote teams. Proven track record of optimizing model inference latency by 65%, reducing GPU infrastructure costs, and building automated multi-agent systems with tool-calling capabilities.

EXPERIENCE
Staff AI Infrastructure Engineer | TensorScale India (2022 - Present)
- Architected enterprise multi-agent workflow engine orchestrating 50M+ daily agent interactions using Gemini and custom tool servers (MCP).
- Standardized low-latency LLM inference pipelines using vLLM and Triton Inference Server, achieving sub-20ms time-to-first-token.
- Built automated neural model evaluation harness integrating automated regression benchmarks across accuracy, toxicity, and latency metrics.

Senior Machine Learning Automation Engineer | Apex AI Systems India (2019 - 2022)
- Designed end-to-end automated MLOps pipelines using Kubeflow, Airflow, and PyTorch for multi-modal vision-language transformers.
- Implemented real-time anomaly detection agent systems monitoring distributed microservices telemetry.
- Reduced model deployment cycle times from weeks to 15 minutes through CI/CD integration and automated canary deployment strategies.

TECHNICAL SKILLS
Languages: Python, TypeScript, C++, Rust, SQL, Bash
AI/ML Frameworks: PyTorch, TensorFlow, Transformers, LangChain, vLLM, TensorRT-LLM, LlamaIndex, JAX
Agentic Systems & MCP: Model Context Protocol (MCP), Tool Calling, Multi-Agent Swarms, Function Calling, ReAct
Cloud & Infrastructure: GCP (Cloud Run, Vertex AI, Kubernetes Engine), AWS, Docker, Kubernetes, Ray, Triton
Databases & Vector DBs: PostgreSQL, Pinecone, Qdrant, Redis, Weaviate
Automation & MLOps: Airflow, Kubeflow, Prometheus, Grafana, MLflow, GitHub Actions`,
  resumeFileName: 'Alex_Chen_Senior_AI_Engineer_India.pdf',
  parsedResume: {
    candidateName: 'Alex Chen',
    headline: 'Senior AI & Automation Systems Engineer',
    yearsOfExperience: 7,
    primarySkills: [
      'Model Context Protocol (MCP)',
      'Multi-Agent Architectures',
      'vLLM / TensorRT-LLM',
      'PyTorch',
      'TypeScript',
      'Python',
      'GCP / Kubernetes',
      'LLM Orchestration',
    ],
    secondarySkills: [
      'Rust',
      'Triton Server',
      'Pinecone / Qdrant',
      'MLOps / Airflow',
      'Distributed Systems',
      'Docker',
    ],
    pastRoles: [
      {
        title: 'Staff AI Infrastructure Engineer',
        company: 'TensorScale India',
        duration: '2022 - Present',
        highlights: [
          'Architected enterprise multi-agent workflow engine handling 50M+ daily agent interactions in Bengaluru',
          'Standardized low-latency LLM inference using vLLM and Triton with sub-20ms TTFT',
          'Built automated neural evaluation harness across accuracy and latency metrics',
        ],
      },
      {
        title: 'Senior Machine Learning Automation Engineer',
        company: 'Apex AI Systems India',
        duration: '2019 - 2022',
        highlights: [
          'Designed MLOps pipelines using Kubeflow, Airflow, and PyTorch for multimodal transformers',
          'Implemented real-time anomaly detection agent systems',
          'Reduced model deployment cycle from weeks to 15 minutes',
        ],
      },
    ],
    education: ['B.Tech / M.Tech in CS & Artificial Intelligence, Tier-1 Institute'],
    certifications: ['Google Cloud Certified Professional Machine Learning Engineer', 'AWS Solutions Architect'],
    summary: 'Senior AI & Automation Engineer with 7+ years deploying large-scale neural networks, multi-agent frameworks, and high-performance LLM inference servers in production across India and global remote setups.',
  },
  targetTitles: [
    'Senior AI Engineer',
    'AI Systems Architect',
    'Senior Automation & Agent Engineer',
    'Staff Machine Learning Engineer',
    'MLOps & LLM Infrastructure Lead',
  ],
  keyTechnologies: [
    'Python',
    'TypeScript',
    'Model Context Protocol (MCP)',
    'PyTorch',
    'vLLM',
    'GCP / Cloud Run',
    'Agentic Frameworks',
    'Vector DBs',
  ],
  preferredLocations: ['Bengaluru, India', 'Remote (India)', 'Hyderabad, India', 'Delhi NCR / Gurgaon', 'Pune, India', 'Mumbai, India'],
  preferredPortals: ['LinkedIn', 'Naukri', 'Company Career Portal', 'YC WorkAtAStartups'],
  remotePreference: 'REMOTE_ONLY',
  minSalaryUsd: 28, // Representing 28 LPA in INR
  targetCompanies: ['TensorScale India', 'Flipkart', 'PhonePe', 'Google India', 'Atlassian India', 'Microsoft India', 'Razorpay', 'Swiggy'],
  excludedKeywords: ['Unpaid', 'Junior', 'Sales Engineer', 'PHP', 'WordPress'],
  careerLevel: 'SENIOR',
};

export const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'job-101',
    title: 'Staff AI Agent Systems & MCP Infrastructure Lead',
    company: 'Flipkart AI Labs',
    location: 'Bengaluru, KA (Hybrid / Remote India)',
    isRemote: true,
    employmentType: 'Full-Time',
    salaryRange: '₹42 LPA - ₹65 LPA + Stock Options',
    description: 'Flipkart AI Labs is building autonomous agent infrastructure for e-commerce search, customer engagement, and supply chain automation in India. We are seeking a Staff AI Systems Engineer to lead the design of tool-calling servers, Model Context Protocol (MCP) integrations, and scalable multi-agent coordination runtimes handling tens of millions of tool invocations daily.',
    requirements: [
      '5+ years experience building production AI systems, distributed microservices, and LLM orchestration',
      'Deep hands-on expertise with Model Context Protocol (MCP), LLM function calling, and agentic workflows',
      'Strong fluency in TypeScript/Node.js or Python with high concurrency',
      'Experience optimizing model latency and orchestration pipelines on GCP or AWS',
    ],
    techStack: ['TypeScript', 'Python', 'Model Context Protocol (MCP)', 'vLLM', 'GCP', 'PostgreSQL', 'Redis'],
    postedDate: '2 hours ago',
    portalSource: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/search/?keywords=Staff+AI+Systems+Engineer+Flipkart&location=India',
    matchBreakdown: {
      techStackScore: 98,
      experienceScore: 95,
      roleScopeScore: 96,
      locationScore: 100,
      overallScore: 97,
    },
    priorityLevel: 'HIGH_MATCH',
    matchingSkills: ['Model Context Protocol (MCP)', 'TypeScript', 'Python', 'Multi-Agent Architectures', 'vLLM', 'GCP'],
    missingSkills: ['Redis Streams tuning'],
    matchRationale: 'Exceptional 97% alignment on LinkedIn. Your background leading 50M+ daily agent interaction systems in Bengaluru and expertise with MCP protocol tool servers directly matches Flipkart AI Labs requirements.',
    customBullets: [
      'Spearheaded 50M+ daily multi-agent tool execution pipeline in Bengaluru leveraging MCP standards and sub-20ms vLLM inference.',
      'Architected resilient microservice agent runtimes on GCP Cloud Run with automated evaluation harnesses.',
    ],
    status: 'NEW',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    groundingSources: [
      { title: 'Flipkart Careers - LinkedIn India Job Listing', url: 'https://www.linkedin.com/jobs/search/?keywords=Staff+AI+Systems+Engineer+Flipkart&location=India' },
    ],
  },
  {
    id: 'job-102',
    title: 'Principal AI Automation Lead & Agent Architect',
    company: 'TensorScale India',
    location: 'Bengaluru / Remote (India)',
    isRemote: true,
    employmentType: 'Full-Time',
    salaryRange: '₹38 LPA - ₹58 LPA',
    description: 'Leading autonomous LLM agent systems and tool integration infrastructure in Bengaluru. Seeking an experienced AI Architect to scale high-concurrency Model Context Protocol (MCP) tool pipelines across enterprise software products.',
    requirements: [
      '6+ years in AI systems architecture, agentic tool workflows, and distributed microservices',
      'Expertise in Python, TypeScript, PyTorch, vLLM, and cloud inference serving',
      'Track record building enterprise-grade MLOps pipelines in India',
    ],
    techStack: ['Python', 'TypeScript', 'Model Context Protocol (MCP)', 'vLLM', 'PyTorch', 'GCP'],
    postedDate: '3 hours ago',
    portalSource: 'Naukri',
    url: 'https://www.naukri.com/jobs-in-india?k=Principal%20AI%20Automation%20Lead%20TensorScale',
    matchBreakdown: {
      techStackScore: 97,
      experienceScore: 94,
      roleScopeScore: 95,
      locationScore: 98,
      overallScore: 96,
    },
    priorityLevel: 'HIGH_MATCH',
    matchingSkills: ['Model Context Protocol (MCP)', 'Python', 'TypeScript', 'vLLM', 'PyTorch', 'GCP'],
    missingSkills: ['Kubernetes Operators'],
    matchRationale: 'Outstanding 96% match on Naukri India. Matches your core MCP protocol architecture background and target compensation expectations.',
    customBullets: [
      'Architected sub-20ms TTFT inference pipelines and enterprise multi-agent workflows handling 50M+ operations in India.',
      'Pioneered tool-calling server protocols reducing model orchestration latency by 65%.',
    ],
    status: 'NEW',
    detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    groundingSources: [
      { title: 'Naukri.com India Listing - TensorScale AI Lead', url: 'https://www.naukri.com/ai-architect-jobs-in-bengaluru-bangalore?k=AI%20Architect%20TensorScale&l=India' },
    ],
  },
  {
    id: 'job-103',
    title: 'Senior Neural Network Deployment & MLOps Engineer',
    company: 'Swiggy AI Labs',
    location: 'Bengaluru, KA (Remote India)',
    isRemote: true,
    employmentType: 'Full-Time',
    salaryRange: '₹35 LPA - ₹52 LPA + ESOPs',
    description: 'Swiggy AI Labs is optimizing large-scale recommendation transformers and multimodal vision-language models for millions of orders in India. Looking for a Senior Engineer to build automated deployment pipelines, Triton/vLLM serving kernels, and real-time MLOps evaluation suites.',
    requirements: [
      '4+ years in ML infrastructure, model quantization, and production inference optimization',
      'Proficiency in PyTorch, TensorRT-LLM, vLLM, and Triton Inference Server',
      'Hands-on experience with Kubernetes, Ray, and CI/CD for ML models in India',
    ],
    techStack: ['Python', 'PyTorch', 'TensorRT-LLM', 'vLLM', 'Triton', 'Kubernetes', 'Ray'],
    postedDate: '5 hours ago',
    portalSource: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/search/?keywords=Senior+MLOps+Engineer+Swiggy&location=India',
    matchBreakdown: {
      techStackScore: 94,
      experienceScore: 92,
      roleScopeScore: 91,
      locationScore: 100,
      overallScore: 93,
    },
    priorityLevel: 'HIGH_MATCH',
    matchingSkills: ['PyTorch', 'vLLM', 'Triton Server', 'Kubernetes', 'GCP', 'Python'],
    missingSkills: ['TensorRT C++ extensions'],
    matchRationale: 'Strong 93% match on LinkedIn. Direct overlap in low-latency LLM serving (vLLM, Triton) and automated ML deployment pipelines.',
    customBullets: [
      'Standardized production vLLM & Triton serving infrastructure delivering sub-20ms time-to-first-token for high-throughput LLM workloads.',
      'Designed automated Kubeflow and Airflow deployment pipelines cutting deployment cycle times from weeks to 15 minutes.',
    ],
    status: 'NOTIFIED' as any,
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    groundingSources: [
      { title: 'LinkedIn India - Swiggy MLOps Engineer', url: 'https://www.linkedin.com/jobs/search/?keywords=Senior+MLOps+Engineer+Swiggy&location=India' },
    ],
  },
  {
    id: 'job-104',
    title: 'Lead Agent Infrastructure & LLM Systems Engineer',
    company: 'PhonePe',
    location: 'Bengaluru / Remote (India)',
    isRemote: true,
    employmentType: 'Full-Time',
    salaryRange: '₹40 LPA - ₹60 LPA',
    description: 'Build enterprise automation agents connecting financial databases with LLM tool-calling models at PhonePe. Responsible for agent execution monitoring, real-time alert triggers, and SDK development.',
    requirements: [
      'Experience with TypeScript, Python, and Vector Databases (Pinecone, Qdrant)',
      'Building agent workflows, RAG systems, and tool integration interfaces',
    ],
    techStack: ['TypeScript', 'Python', 'Pinecone', 'LangChain', 'PostgreSQL', 'Docker'],
    postedDate: '1 day ago',
    portalSource: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/search/?keywords=Lead+AI+Engineer+PhonePe&location=India',
    matchBreakdown: {
      techStackScore: 92,
      experienceScore: 90,
      roleScopeScore: 91,
      locationScore: 95,
      overallScore: 92,
    },
    priorityLevel: 'STRATEGIC',
    matchingSkills: ['TypeScript', 'Python', 'Pinecone', 'PostgreSQL', 'Multi-Agent Architectures'],
    missingSkills: ['GraphQL schema design'],
    matchRationale: 'Solid 92% match on LinkedIn India. Matches your technical stack, vector DB experience, and target compensation range in India.',
    customBullets: [
      'Architected multi-agent tool execution platforms integrating vector indices and enterprise PostgreSQL databases in Bengaluru.',
    ],
    status: 'SAVED',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    groundingSources: [
      { title: 'PhonePe Careers - LinkedIn Listing', url: 'https://www.linkedin.com/jobs/search/?keywords=Lead+AI+Engineer+PhonePe&location=India' },
    ],
  },
];

export const INITIAL_TRACES: McpAgentTrace[] = [
  {
    id: 'trace-001',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    agentName: 'ResumeAnalyzerAgent',
    action: 'Parsed candidate CV PDF & structured skills taxonomy for India market',
    mcpToolsUsed: ['mcp_resume_parser', 'vector_embeddings_indexer'],
    inputPayload: { fileName: 'Alex_Chen_Senior_AI_Engineer_India.pdf', byteSize: 48210 },
    outputSummary: { candidateName: 'Alex Chen', extractedSkillsCount: 14, primaryMatchVector: 'AI_AGENT_MLOPS_SENIOR_INDIA' },
    latencyMs: 420,
    status: 'SUCCESS',
  },
  {
    id: 'trace-002',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    agentName: 'MCPWebScoutAgent',
    action: 'Scouted active job portals via LinkedIn & Naukri India Search Grounding',
    mcpToolsUsed: ['mcp_google_search_grounding', 'mcp_job_portal_scraper'],
    inputPayload: { keywords: ['Senior AI Engineer', 'MCP', 'vLLM', 'Model Context Protocol'], targetLocation: 'Bengaluru / India Remote' },
    outputSummary: { jobListingsDiscovered: 14, parsedPortals: ['LinkedIn India', 'Naukri.com'] },
    latencyMs: 1150,
    status: 'SUCCESS',
  },
  {
    id: 'trace-003',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    agentName: 'CandidateMatchEvaluator',
    action: 'Cross-referenced candidate profile matrix against discovered opportunities in India',
    mcpToolsUsed: ['mcp_cross_reference_evaluator', 'skill_gap_delta_calculator'],
    inputPayload: { candidateId: 'Alex Chen', targetJobCount: 14 },
    outputSummary: { highMatchesFound: 3, strategicMatchesFound: 1, averageMatchScore: 94.5 },
    latencyMs: 680,
    status: 'SUCCESS',
  },
  {
    id: 'trace-004',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    agentName: 'NotificationAlertAgent',
    action: 'Dispatched priority match alert for Flipkart AI Labs (97% Match on LinkedIn)',
    mcpToolsUsed: ['mcp_app_notification_dispatcher', 'priority_alert_queue'],
    inputPayload: { jobId: 'job-101', matchScore: 97, channel: 'IN_APP_TOAST' },
    outputSummary: { notificationDelivered: true, alertId: 'notif-101' },
    latencyMs: 110,
    status: 'SUCCESS',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-101',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    jobId: 'job-101',
    jobTitle: 'Staff AI Agent Systems & MCP Infrastructure Lead',
    company: 'Flipkart AI Labs',
    matchScore: 97,
    priorityLevel: 'HIGH_MATCH',
    message: '🔥 High 97% Match Detected on LinkedIn! Your background in MCP and 50M+ agent interactions perfectly aligns with Flipkart AI Labs in Bengaluru.',
    isRead: false,
  },
  {
    id: 'notif-102',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    jobId: 'job-102',
    jobTitle: 'Principal AI Automation Lead & Agent Architect',
    company: 'TensorScale India',
    matchScore: 96,
    priorityLevel: 'HIGH_MATCH',
    message: '✨ High 96% Match Detected on Naukri India! Matches your low-latency vLLM & MCP tool server expertise.',
    isRead: false,
  },
];

export const INITIAL_SCOUT_CONFIG: ScoutConfig = {
  autoScanEnabled: true,
  scanIntervalMinutes: 15,
  minMatchScoreThreshold: 75,
  enabledSources: ['LinkedIn', 'Naukri', 'Company Career Portals', 'YC WorkAtAStartups', 'Glassdoor', 'Indeed'],
  lastScanTimestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  totalJobsScouted: 52,
};

"""
Sample data for job profile matching system including employee profiles and job demands.
"""

# Sample employee profiles
EMPLOYEES = {
    'alice': {
        'emp_id': '001',
        'name': 'Alice',
        'role': 'Data Scientist',
        'grade': 'Senior',
        'office': 'New York',
        'can_play': ['Data Scientist', 'Machine Learning Engineer'],
        'tools': {
            'Python': 5,
            'R': 4,
            'TensorFlow': 3
        }
    },
    'bob': {
        'emp_id': '002',
        'name': 'Bob',
        'role': 'Software Engineer',
        'grade': 'Mid',
        'office': 'San Francisco',
        'can_play': ['Software Engineer', 'Backend Developer'],
        'tools': {
            'Java': 4,
            'Python': 3,
            'SQL': 5
        }
    },
    'charlie': {
        'emp_id': '003',
        'name': 'Charlie',
        'role': 'Data Analyst',
        'grade': 'Junior',
        'office': 'New York',
        'can_play': ['Data Analyst', 'Business Analyst'],
        'tools': {
            'Excel': 5,
            'SQL': 4,
            'Python': 2
        }
    },
    'david': {
        'emp_id': '004',
        'name': 'David',
        'role': 'Frontend Developer',
        'grade': 'Senior',
        'office': 'London',
        'can_play': ['Frontend Developer', 'UI Designer'],
        'tools': {
            'JavaScript': 5,
            'React': 5,
            'TypeScript': 4,
            'HTML/CSS': 5
        }
    },
    'emma': {
        'emp_id': '005',
        'name': 'Emma',
        'role': 'Full Stack Developer',
        'grade': 'Mid',
        'office': 'Berlin',
        'can_play': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
        'tools': {
            'JavaScript': 4,
            'Node.js': 4,
            'React': 4,
            'MongoDB': 3,
            'Python': 3
        }
    },
    'frank': {
        'emp_id': '006',
        'name': 'Frank',
        'role': 'DevOps Engineer',
        'grade': 'Senior',
        'office': 'San Francisco',
        'can_play': ['DevOps Engineer', 'Cloud Architect'],
        'tools': {
            'Docker': 5,
            'Kubernetes': 4,
            'AWS': 5,
            'Python': 3,
            'Git': 5
        }
    },
    'grace': {
        'emp_id': '007',
        'name': 'Grace',
        'role': 'Machine Learning Engineer',
        'grade': 'Lead',
        'office': 'New York',
        'can_play': ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
        'tools': {
            'Python': 5,
            'TensorFlow': 5,
            'PyTorch': 4,
            'Scikit-learn': 5,
            'SQL': 3
        }
    },
    'henry': {
        'emp_id': '008',
        'name': 'Henry',
        'role': 'Database Administrator',
        'grade': 'Senior',
        'office': 'Chicago',
        'can_play': ['Database Administrator', 'Data Engineer'],
        'tools': {
            'SQL': 5,
            'PostgreSQL': 5,
            'MySQL': 4,
            'MongoDB': 3,
            'Python': 2
        }
    },
    'isabel': {
        'emp_id': '009',
        'name': 'Isabel',
        'role': 'UX Designer',
        'grade': 'Mid',
        'office': 'Austin',
        'can_play': ['UX Designer', 'UI Designer'],
        'tools': {
            'Figma': 5,
            'Photoshop': 4,
            'Sketch': 3,
            'HTML/CSS': 3
        }
    },
    'jack': {
        'emp_id': '010',
        'name': 'Jack',
        'role': 'Security Engineer',
        'grade': 'Senior',
        'office': 'London',
        'can_play': ['Security Engineer', 'DevOps Engineer'],
        'tools': {
            'Python': 4,
            'AWS': 4,
            'Docker': 3,
            'Linux': 5,
            'Penetration Testing': 5
        }
    },
    'karen': {
        'emp_id': '011',
        'name': 'Karen',
        'role': 'Product Manager',
        'grade': 'Lead',
        'office': 'San Francisco',
        'can_play': ['Product Manager', 'Project Manager'],
        'tools': {
            'JIRA': 5,
            'Excel': 4,
            'SQL': 3,
            'Tableau': 3
        }
    },
    'leo': {
        'emp_id': '012',
        'name': 'Leo',
        'role': 'Mobile Developer',
        'grade': 'Mid',
        'office': 'Berlin',
        'can_play': ['Mobile Developer', 'Frontend Developer'],
        'tools': {
            'Swift': 5,
            'Kotlin': 4,
            'React Native': 3,
            'JavaScript': 3,
            'Git': 4
        }
    },
    'mia': {
        'emp_id': '013',
        'name': 'Mia',
        'role': 'Data Engineer',
        'grade': 'Senior',
        'office': 'Seattle',
        'can_play': ['Data Engineer', 'Data Scientist'],
        'tools': {
            'Python': 5,
            'SQL': 5,
            'Spark': 4,
            'AWS': 4,
            'Hadoop': 3
        }
    },
    'noah': {
        'emp_id': '014',
        'name': 'Noah',
        'role': 'QA Engineer',
        'grade': 'Mid',
        'office': 'Bangalore',
        'can_play': ['QA Engineer', 'Backend Developer'],
        'tools': {
            'Selenium': 5,
            'Python': 4,
            'Java': 3,
            'SQL': 3,
            'JIRA': 4
        }
    },
    'olivia': {
        'emp_id': '015',
        'name': 'Olivia',
        'role': 'AI Researcher',
        'grade': 'Principal',
        'office': 'Boston',
        'can_play': ['AI Researcher', 'Data Scientist', 'Machine Learning Engineer'],
        'tools': {
            'Python': 5,
            'TensorFlow': 5,
            'PyTorch': 5,
            'R': 4,
            'C++': 3
        }
    },
    'paul': {
        'emp_id': '016',
        'name': 'Paul',
        'role': 'Technical Writer',
        'grade': 'Mid',
        'office': 'Remote',
        'can_play': ['Technical Writer', 'Project Manager'],
        'tools': {
            'Markdown': 5,
            'Git': 4,
            'HTML': 3,
            'JIRA': 4
        }
    },
    'quinn': {
        'emp_id': '017',
        'name': 'Quinn',
        'role': 'Cloud Architect',
        'grade': 'Lead',
        'office': 'Seattle',
        'can_play': ['Cloud Architect', 'DevOps Engineer', 'Software Engineer'],
        'tools': {
            'AWS': 5,
            'Azure': 4,
            'GCP': 4,
            'Terraform': 5,
            'Docker': 5,
            'Kubernetes': 5
        }
    },
    'ryan': {
        'emp_id': '018',
        'name': 'Ryan',
        'role': 'Backend Developer',
        'grade': 'Senior',
        'office': 'Toronto',
        'can_play': ['Backend Developer', 'Software Engineer', 'DevOps Engineer'],
        'tools': {
            'Java': 5,
            'Spring': 5,
            'SQL': 4,
            'Docker': 3,
            'Git': 4
        }
    },
    'sophia': {
        'emp_id': '019',
        'name': 'Sophia',
        'role': 'UI Designer',
        'grade': 'Senior',
        'office': 'New York',
        'can_play': ['UI Designer', 'UX Designer'],
        'tools': {
            'Figma': 5,
            'Photoshop': 5,
            'Illustrator': 5,
            'HTML/CSS': 4
        }
    },
    'thomas': {
        'emp_id': '020',
        'name': 'Thomas',
        'role': 'Project Manager',
        'grade': 'Senior',
        'office': 'London',
        'can_play': ['Project Manager', 'Product Manager'],
        'tools': {
            'JIRA': 5,
            'Excel': 5,
            'MS Project': 4,
            'Confluence': 4
        }
    },
    'uma': {
        'emp_id': '021',
        'name': 'Uma',
        'role': 'Data Scientist',
        'grade': 'Mid',
        'office': 'Singapore',
        'can_play': ['Data Scientist', 'Data Analyst'],
        'tools': {
            'Python': 4,
            'R': 3,
            'SQL': 4,
            'Tableau': 4,
            'Scikit-learn': 3
        }
    },
    'victor': {
        'emp_id': '022',
        'name': 'Victor',
        'role': 'Software Engineer',
        'grade': 'Junior',
        'office': 'Bangalore',
        'can_play': ['Software Engineer', 'Backend Developer'],
        'tools': {
            'Java': 3,
            'Python': 3,
            'Git': 4,
            'SQL': 2
        }
    },
    'wendy': {
        'emp_id': '023',
        'name': 'Wendy',
        'role': 'Frontend Developer',
        'grade': 'Junior',
        'office': 'Remote',
        'can_play': ['Frontend Developer'],
        'tools': {
            'JavaScript': 3,
            'React': 3,
            'HTML/CSS': 4,
            'Git': 3
        }
    },
    'xavier': {
        'emp_id': '024',
        'name': 'Xavier',
        'role': 'DevOps Engineer',
        'grade': 'Mid',
        'office': 'Austin',
        'can_play': ['DevOps Engineer', 'Backend Developer'],
        'tools': {
            'Docker': 4,
            'Kubernetes': 3,
            'AWS': 4,
            'Python': 3,
            'Bash': 4
        }
    },
    'yasmin': {
        'emp_id': '025',
        'name': 'Yasmin',
        'role': 'Business Analyst',
        'grade': 'Senior',
        'office': 'Chicago',
        'can_play': ['Business Analyst', 'Data Analyst', 'Product Manager'],
        'tools': {
            'Excel': 5,
            'SQL': 4,
            'Tableau': 4,
            'JIRA': 3
        }
    },
    'zach': {
        'emp_id': '026',
        'name': 'Zach',
        'role': 'Full Stack Developer',
        'grade': 'Lead',
        'office': 'San Francisco',
        'can_play': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
        'tools': {
            'JavaScript': 5,
            'TypeScript': 5,
            'React': 5,
            'Node.js': 5,
            'MongoDB': 4,
            'AWS': 4
        }
    },
    'amy': {
        'emp_id': '027',
        'name': 'Amy',
        'role': 'Machine Learning Engineer',
        'grade': 'Mid',
        'office': 'Boston',
        'can_play': ['Machine Learning Engineer', 'Data Scientist'],
        'tools': {
            'Python': 4,
            'TensorFlow': 4,
            'PyTorch': 3,
            'SQL': 3,
            'Git': 4
        }
    },
    'ben': {
        'emp_id': '028',
        'name': 'Ben',
        'role': 'Mobile Developer',
        'grade': 'Senior',
        'office': 'Tokyo',
        'can_play': ['Mobile Developer', 'Frontend Developer'],
        'tools': {
            'Swift': 5,
            'Objective-C': 4,
            'Kotlin': 3,
            'Java': 3,
            'Git': 4
        }
    },
    'chloe': {
        'emp_id': '029',
        'name': 'Chloe',
        'role': 'Data Analyst',
        'grade': 'Mid',
        'office': 'London',
        'can_play': ['Data Analyst', 'Business Analyst'],
        'tools': {
            'Excel': 5,
            'SQL': 4,
            'Tableau': 4,
            'Power BI': 3,
            'Python': 2
        }
    },
    'daniel': {
        'emp_id': '030',
        'name': 'Daniel',
        'role': 'Security Engineer',
        'grade': 'Lead',
        'office': 'Berlin',
        'can_play': ['Security Engineer', 'DevOps Engineer', 'Software Engineer'],
        'tools': {
            'Python': 4,
            'Linux': 5,
            'AWS': 4,
            'Docker': 4,
            'Penetration Testing': 5
        }
    },
    'eliza': {
        'emp_id': '031',
        'name': 'Eliza',
        'role': 'UX Designer',
        'grade': 'Senior',
        'office': 'Sydney',
        'can_play': ['UX Designer', 'UI Designer', 'Product Manager'],
        'tools': {
            'Figma': 5,
            'Sketch': 4,
            'Adobe XD': 4,
            'InVision': 4,
            'HTML/CSS': 3
        }
    },
    'felix': {
        'emp_id': '032',
        'name': 'Felix',
        'role': 'Database Administrator',
        'grade': 'Mid',
        'office': 'Toronto',
        'can_play': ['Database Administrator', 'Backend Developer'],
        'tools': {
            'SQL': 5,
            'PostgreSQL': 4,
            'MySQL': 4,
            'Oracle': 3,
            'Python': 2
        }
    },
    'gina': {
        'emp_id': '033',
        'name': 'Gina',
        'role': 'Product Manager',
        'grade': 'Senior',
        'office': 'Singapore',
        'can_play': ['Product Manager', 'Business Analyst'],
        'tools': {
            'JIRA': 5,
            'Confluence': 4,
            'Excel': 4,
            'SQL': 3,
            'Tableau': 3
        }
    },
    'hector': {
        'emp_id': '034',
        'name': 'Hector',
        'role': 'QA Engineer',
        'grade': 'Senior',
        'office': 'Bangalore',
        'can_play': ['QA Engineer', 'DevOps Engineer'],
        'tools': {
            'Selenium': 5,
            'Python': 4,
            'Java': 3,
            'Jenkins': 4,
            'JIRA': 4
        }
    },
    'iris': {
        'emp_id': '035',
        'name': 'Iris',
        'role': 'Data Engineer',
        'grade': 'Lead',
        'office': 'New York',
        'can_play': ['Data Engineer', 'Data Scientist', 'Database Administrator'],
        'tools': {
            'Python': 5,
            'SQL': 5,
            'Spark': 5,
            'Hadoop': 4,
            'AWS': 4,
            'Airflow': 5
        }
    },
    'jake': {
        'emp_id': '036',
        'name': 'Jake',
        'role': 'Technical Writer',
        'grade': 'Senior',
        'office': 'Remote',
        'can_play': ['Technical Writer', 'Project Manager'],
        'tools': {
            'Markdown': 5,
            'Git': 4,
            'HTML': 4,
            'JIRA': 4,
            'Confluence': 5
        }
    },
    'kelly': {
        'emp_id': '037',
        'name': 'Kelly',
        'role': 'AI Researcher',
        'grade': 'Senior',
        'office': 'Boston',
        'can_play': ['AI Researcher', 'Machine Learning Engineer'],
        'tools': {
            'Python': 5,
            'TensorFlow': 5,
            'PyTorch': 4,
            'C++': 3,
            'CUDA': 4
        }
    },
    'liam': {
        'emp_id': '038',
        'name': 'Liam',
        'role': 'Cloud Architect',
        'grade': 'Principal',
        'office': 'Seattle',
        'can_play': ['Cloud Architect', 'DevOps Engineer', 'Software Engineer'],
        'tools': {
            'AWS': 5,
            'Azure': 5,
            'GCP': 5,
            'Terraform': 5,
            'Docker': 5,
            'Kubernetes': 5
        }
    },
    'maya': {
        'emp_id': '039',
        'name': 'Maya',
        'role': 'UI Designer',
        'grade': 'Mid',
        'office': 'London',
        'can_play': ['UI Designer', 'UX Designer'],
        'tools': {
            'Figma': 4,
            'Photoshop': 5,
            'Illustrator': 5,
            'HTML/CSS': 3
        }
    },
    'nathan': {
        'emp_id': '040',
        'name': 'Nathan',
        'role': 'Backend Developer',
        'grade': 'Lead',
        'office': 'Berlin',
        'can_play': ['Backend Developer', 'Software Engineer', 'DevOps Engineer'],
        'tools': {
            'Go': 5,
            'Python': 4,
            'Docker': 4,
            'Kubernetes': 4,
            'PostgreSQL': 4,
            'Git': 5
        }
    },
    'olivia_p': {
        'emp_id': '041',
        'name': 'Olivia P.',
        'role': 'Project Manager',
        'grade': 'Mid',
        'office': 'Sydney',
        'can_play': ['Project Manager', 'Business Analyst'],
        'tools': {
            'JIRA': 4,
            'Confluence': 4,
            'MS Project': 4,
            'Excel': 5
        }
    },
    'peter': {
        'emp_id': '042',
        'name': 'Peter',
        'role': 'Software Engineer',
        'grade': 'Principal',
        'office': 'San Francisco',
        'can_play': ['Software Engineer', 'Backend Developer', 'Full Stack Developer'],
        'tools': {
            'Java': 5,
            'Python': 5,
            'Go': 4,
            'AWS': 4,
            'Docker': 4,
            'Kubernetes': 4
        }
    },
    'quinn_r': {
        'emp_id': '043',
        'name': 'Quinn R.',
        'role': 'Data Scientist',
        'grade': 'Junior',
        'office': 'Toronto',
        'can_play': ['Data Scientist', 'Data Analyst'],
        'tools': {
            'Python': 3,
            'R': 3,
            'SQL': 3,
            'Scikit-learn': 2
        }
    },
    'rachel': {
        'emp_id': '044',
        'name': 'Rachel',
        'role': 'Frontend Developer',
        'grade': 'Lead',
        'office': 'Austin',
        'can_play': ['Frontend Developer', 'UI Designer', 'Full Stack Developer'],
        'tools': {
            'JavaScript': 5,
            'TypeScript': 5,
            'React': 5,
            'Vue.js': 4,
            'HTML/CSS': 5,
            'Git': 5
        }
    },
    'steve': {
        'emp_id': '045',
        'name': 'Steve',
        'role': 'DevOps Engineer',
        'grade': 'Junior',
        'office': 'Chicago',
        'can_play': ['DevOps Engineer'],
        'tools': {
            'Docker': 3,
            'AWS': 3,
            'Linux': 4,
            'Bash': 3,
            'Git': 4
        }
    },
    'tina': {
        'emp_id': '046',
        'name': 'Tina',
        'role': 'Business Analyst',
        'grade': 'Mid',
        'office': 'Bangalore',
        'can_play': ['Business Analyst', 'Data Analyst'],
        'tools': {
            'Excel': 5,
            'SQL': 3,
            'Tableau': 3,
            'JIRA': 4
        }
    },
    'ulrich': {
        'emp_id': '047',
        'name': 'Ulrich',
        'role': 'Mobile Developer',
        'grade': 'Lead',
        'office': 'Berlin',
        'can_play': ['Mobile Developer', 'Frontend Developer', 'Full Stack Developer'],
        'tools': {
            'Swift': 5,
            'Kotlin': 5,
            'React Native': 5,
            'JavaScript': 4,
            'TypeScript': 4,
            'Git': 5
        }
    },
    'victoria': {
        'emp_id': '048',
        'name': 'Victoria',
        'role': 'Machine Learning Engineer',
        'grade': 'Principal',
        'office': 'New York',
        'can_play': ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
        'tools': {
            'Python': 5,
            'TensorFlow': 5,
            'PyTorch': 5,
            'Scikit-learn': 5,
            'C++': 4,
            'CUDA': 4
        }
    },
    'william': {
        'emp_id': '049',
        'name': 'William',
        'role': 'Full Stack Developer',
        'grade': 'Senior',
        'office': 'Remote',
        'can_play': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
        'tools': {
            'JavaScript': 5,
            'TypeScript': 4,
            'React': 5,
            'Node.js': 5,
            'MongoDB': 4,
            'AWS': 3
        }
    },
    'xena': {
        'emp_id': '050',
        'name': 'Xena',
        'role': 'Data Engineer',
        'grade': 'Mid',
        'office': 'Singapore',
        'can_play': ['Data Engineer', 'Data Analyst'],
        'tools': {
            'Python': 4,
            'SQL': 4,
            'Spark': 3,
            'AWS': 3,
            'Airflow': 3
        }
    },
    'yusuf': {
        'emp_id': '051',
        'name': 'Yusuf',
        'role': 'Security Engineer',
        'grade': 'Mid',
        'office': 'London',
        'can_play': ['Security Engineer', 'DevOps Engineer'],
        'tools': {
            'Python': 4,
            'Linux': 4,
            'AWS': 3,
            'Docker': 3,
            'Penetration Testing': 4
        }
    },
    'zoe': {
        'emp_id': '052',
        'name': 'Zoe',
        'role': 'UX Designer',
        'grade': 'Junior',
        'office': 'Toronto',
        'can_play': ['UX Designer'],
        'tools': {
            'Figma': 3,
            'Sketch': 3,
            'Adobe XD': 4,
            'InVision': 3
        }
    },
    'aaron': {
        'emp_id': '053',
        'name': 'Aaron',
        'role': 'QA Engineer',
        'grade': 'Lead',
        'office': 'Seattle',
        'can_play': ['QA Engineer', 'DevOps Engineer', 'Backend Developer'],
        'tools': {
            'Selenium': 5,
            'Python': 5,
            'Java': 4,
            'Jenkins': 5,
            'Docker': 4,
            'JIRA': 5
        }
    }
}

# Sample job demands
DEMANDS = {
    'demand_1': {
        'id': 'D001',
        'role': 'Data Scientist',
        'grade': 'Senior',
        'start_date': '2023-01-01',
        'end_date': '2023-06-30',
        'office': 'New York',
        'job_description': 'Looking for a data scientist with strong Python and machine learning skills.'
    },
    'demand_2': {
        'id': 'D002',
        'role': 'Software Engineer',
        'grade': 'Mid',
        'start_date': '2023-02-01',
        'end_date': '2023-07-31',
        'office': 'San Francisco',
        'job_description': 'Need a software engineer proficient in Java and SQL.'
    }
}

# Available roles
ROLES = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Software Engineer',
    'Backend Developer',
    'Data Analyst',
    'Business Analyst',
    'Frontend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cloud Architect',
    'Product Manager',
    'UX Designer',
    'UI Designer',
    'QA Engineer',
    'Security Engineer',
    'Database Administrator',
    'Mobile Developer',
    'AI Researcher',
    'Data Engineer',
    'Technical Writer',
    'Project Manager'
]

# Available tools/technologies
TOOLS = [
    'Python',
    'R',
    'TensorFlow',
    'Java',
    'SQL',
    'Excel',
    'JavaScript',
    'TypeScript',
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Git',
    'C#',
    'C++',
    'Swift',
    'Kotlin',
    'Go',
    'Rust',
    'Tableau',
    'Power BI',
    'PyTorch',
    'Scikit-learn'
]

# Available offices
OFFICES = [
    'New York',
    'San Francisco',
    'London',
    'Berlin',
    'Singapore',
    'Tokyo',
    'Sydney',
    'Bangalore',
    'Toronto',
    'Austin',
    'Seattle',
    'Chicago',
    'Boston',
    'Remote'
]

# Available grades
GRADES = [
    'Junior',
    'Mid',
    'Senior',
    'Lead',
    'Principal'
]

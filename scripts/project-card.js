class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['name', 'image', 'alt', 'description', 'link', 'link-text', 'date', 'keywords'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get name() {
    return this.getAttribute('name') || 'Project Name';
  }

  get image() {
    return this.getAttribute('image') || '';
  }

  get alt() {
    return this.getAttribute('alt') || 'Project image';
  }

  get description() {
    return this.getAttribute('description') || 'No description available.';
  }

  get link() {
    return this.getAttribute('link') || '#';
  }

  get date() {
    return this.getAttribute('date') || '';
  }

  get keywords() {
    return this.getAttribute('keywords') || '';
  }

  render() {
    const keywords = this.keywords ? this.keywords.split(',').map(k => k.trim()) : [];
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: block;
            --card-bg: var(--bg-card, rgba(255, 255, 255, 0.9));
            --card-border: var(--border-color, rgba(0, 0, 0, 0.1));
            --text-primary: var(--text-primary, #333);
            --text-secondary: var(--text-secondary, #666);
            --accent-color: var(--accent, lightblue);
            --accent-hover: color-mix(in oklab, var(--accent-color), black 20%);
            --card-padding: 1.5rem;
            --card-border-radius: 12px;
            --card-gap: 1rem;
            --image-height: 200px;
            --transition-speed: 0.3s;
        }

        article {
            display: flex;
            flex-direction: column;
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--card-border-radius);
            padding: var(--card-padding);
            transition: transform var(--transition-speed) ease, 
                        box-shadow var(--transition-speed) ease,
                        border-color var(--transition-speed) ease;
            height: 100%;
            backdrop-filter: blur(10px);
            &:hover {
               transform: translateY(-4px);
                box-shadow: 0 8px 24px color-mix(in oklab, var(--accent-color), transparent 60%);
                border-color: var(--accent-color);
            }

            img {
                width: 100%;
                height: var(--image-height);
                object-fit: cover;
                border-radius: calc(var(--card-border-radius) - 4px);
                margin-bottom: var(--card-gap);
                border: 1px solid var(--card-border);
            }

            section {
                display: flex;
                flex-direction: column;
                gap: var(--card-gap);
                flex: 1;

                header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    h2 {
                        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: var(--text-primary);
                        margin: 0;
                        line-height: 1.3;
                    }
                    span.card-date {
                        font-size: 0.9rem;
                        font-style: italic;
                        color: var(--text-secondary);
                    }
                }

                p {
                    font-family: 'Times New Roman', serif;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: var(--text-primary);
                    flex: 1;
                    margin: 0;
                }
                
                .card-keywords {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem 1rem;
                    margin-top: 0.5rem;
                    span.keyword {
                        display: inline-block;
                        padding: 0.25rem 0.75rem;
                        background-color: var(--accent-color);
                        border: 1px solid var(--accent-color);
                        border-radius: 16px;
                        font-size: 0.85rem;
                        color: var(--text-primary);
                    }
                }

                a {
                    display: inline-block;
                    margin-top: auto;
                    padding: 0.75rem 1.5rem;
                    color: var(--text-primary);
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    text-align: center;
                    transition: background-color var(--transition-speed) ease,
                                transform 0.2s ease;
                    border: 2px solid var(--accent-color);
                    &:hover {
                        background-color: #39cbf7; 
                        -webkit-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
                        -moz-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1); 
                        box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
                    }
                    &:focus {
                        outline: 3px solid var(--accent-color);
                        outline-offset: 2px;
                    }
                }
            }

        }

        @media (max-width: 768px) {
            :host {
                --card-padding: 1rem;
                --image-height: 180px;
                --card-gap: 0.75rem;
            }

            .card-title {
                font-size: 1.3rem;
            }

            .card-description {
                font-size: 0.95rem;
            }
        }
      </style>

      <article>
        ${this.image ? `
          <picture>
            <source srcset="${this.image}" type="image/webp">
            <img src="${this.image}" alt="${this.alt}" class="card-image">
          </picture>
        ` : ''}
        
        <section>
          <header>
            <h2>${this.name}</h2>
            ${this.date ? `<span class="card-date">${this.date}</span>` : ''}
          </header>
          
          <p>${this.description}</p>
          
          ${keywords.length > 0 ? `
            <div class="card-keywords">
              ${keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
            </div>
          ` : ''}
          
          <a href="${this.link}" target="_blank" rel="noopener noreferrer">
            Project Details
          </a>
        </section>
      </article>
    `;
  }
}

customElements.define('project-card', ProjectCard);

const localProjects = [
  {
    "name": "Enterprise Risk Metrics Platform",
    "image": "assets/img/llm.jpg",
    "alt": "Enterprise architecture diagram showing risk metrics platform",
    "description": "Developed a derivative metrics Agent based on Program of Thoughts prompt engineering, enabling large language models to generate executable Python scripts from natural language descriptions. Built an enterprise risk metrics auto-generation management platform with code persistence and effective reuse.",
    "link": "projects.html",
    "link-text": "View Details",
    "date": "Jun - Sep 2025",
    "keywords": "LLM, Python, Enterprise Software, Redis, Prompt Engineering"
  },
  {
    "name": "Cloud-native Testing and Automation Architecture",
    "image": "assets/img/dev.jpg",
    "alt": "Cloud-native testing and automation architecture diagram for telecom systems",
    "description": "Developed scalable Python-based automation tools for formula regression in the AAT-LT (Automated Acceptance Test – Load Test) system using modular design and OOP principles. Led data pipeline improvements with Pandas/NumPy for large-scale load testing, reducing test duration by 25%.",
    "link": "projects.html",
    "link-text": "View Details",
    "date": "Aug - Dec 2023 | Shanghai, China",
    "keywords": "Python, Automation, Load Testing, Pandas, NumPy, Kubernetes, Chaos Engineering, Cloud-Native"
  }
];

if (!localStorage.getItem("projects")) {
  localStorage.setItem("projects", JSON.stringify(localProjects));
}

function renderProjectCards(projects, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = '';

  if (!projects || projects.length === 0) {
    container.innerHTML = '<p>No projects found.</p>';
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('project-card');
    card.setAttribute('name', project.name || '');
    card.setAttribute('image', project.image || '');
    card.setAttribute('alt', project.alt || '');
    card.setAttribute('description', project.description || '');
    card.setAttribute('link', project.link || '#');
    card.setAttribute('date', project.date || '');
    card.setAttribute('keywords', project.keywords || '');
    container.appendChild(card);
  });
}

function loadLocalProjects() {
  try {
    const storedData = localStorage.getItem("projects");
    if (!storedData) {
      console.error("No projects found in localStorage");
      alert("No projects found in localStorage");
      return;
    }

    const projects = JSON.parse(storedData);
    renderProjectCards(projects, "cards-display");
    console.log("Loaded projects from localStorage:", projects);
  } catch (error) {
    console.error("Error loading local projects:", error);
    alert("Error loading projects from localStorage: " + error.message);
  }
}

function loadRemoteProjects() {
    const headers = {
      'Content-Type': 'application/json'
    };

    fetch(`https://my-json-server.typicode.com/Esayanubn/jsonSever4CustomElem/projects`, {
      headers: headers
    })
    .then(response => response.json())
    .then(data => {
      renderProjectCards(data, "cards-display");
      console.log("Loaded projects from remote source:", data);
    })
    .catch(error => {
      console.error("Error loading remote projects:", error);
      alert("Error loading projects from remote source: " + error.message);
    });
  }
  
document.addEventListener('DOMContentLoaded', () => {
  const loadLocalBtn = document.getElementById('load-local');
  const loadRemoteBtn = document.getElementById('load-remote');

  if (loadLocalBtn) {
    loadLocalBtn.addEventListener('click', loadLocalProjects);
  }

  if (loadRemoteBtn) {
    loadRemoteBtn.addEventListener('click', loadRemoteProjects);
  }
});


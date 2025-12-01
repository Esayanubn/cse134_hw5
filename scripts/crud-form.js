const crudForm = document.getElementById('crud-form');
const operationSelect = document.getElementById('crud-operation');
const projectNameInput = document.getElementById('project-name');
const imageInput = document.getElementById('project-image');
const altInput = document.getElementById('project-alt');
const descriptionInput = document.getElementById('project-description');
const linkInput = document.getElementById('project-link');
const dateInput = document.getElementById('project-date');
const keywordsInput = document.getElementById('project-keywords');
const errorOutput = document.getElementById('output-error');
const infoOutput = document.getElementById('output-info');
const submitBtn = document.getElementById('submit-btn');

const imageField = document.getElementById('image-field');
const altField = document.getElementById('alt-field');
const descriptionField = document.getElementById('description-field');
const linkField = document.getElementById('link-field');
const dateField = document.getElementById('date-field');
const keywordsField = document.getElementById('keywords-field');

// fields that need to change property
const editableFields = [
  imageInput,
  altInput,
  descriptionInput,
  linkInput,
  dateInput,
  keywordsInput
];

function showError(message) {
  errorOutput.textContent = message;
  errorOutput.style.display = 'block';
  infoOutput.style.display = 'none';
  setTimeout(() => {
    errorOutput.textContent = '';
    errorOutput.style.display = 'none';
  }, 5000);
}

function showInfo(message) {
  infoOutput.textContent = message;
  infoOutput.style.display = 'block';
  errorOutput.style.display = 'none';
  setTimeout(() => {
    infoOutput.textContent = '';
    infoOutput.style.display = 'none';
  }, 5000);
}

function updateFieldAvailability() {
  const operation = operationSelect.value;
  editableFields.forEach(field => {
    field.disabled = false;
    field.removeAttribute('required');
  });

  switch(operation) {
    case 'create':
      imageInput.setAttribute('required', '');
      descriptionInput.setAttribute('required', '');
      linkInput.setAttribute('required', '');
      submitBtn.textContent = 'Create Project';
      break;
      
    case 'read':
      editableFields.forEach(field => {
        field.disabled = true;
      });
      submitBtn.textContent = 'Read Project';
      break;
      
    case 'update':
      editableFields.forEach(field => {
        field.disabled = false;
      });
      submitBtn.textContent = 'Update Project';
      break;
      
    case 'delete':
      editableFields.forEach(field => {
        field.disabled = true;
      });
      submitBtn.textContent = 'Delete Project';
      break;
      
    default:
      editableFields.forEach(field => {
        field.disabled = true;
      });
      submitBtn.textContent = 'Submit';
  }
}

function loadProjects() {
  try {
    const storedData = localStorage.getItem('projects');
    if (!storedData) {
      return [];
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

function saveProjects(projects) {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
}

function findProjectIndexByName(projects, name) {
  return projects.findIndex(project => 
    project.name && project.name.toLowerCase() === name.toLowerCase().trim()
  );
}

// Read operation
function readProject(projectName) {
    const projects = loadProjects();
    const index = findProjectIndexByName(projects, projectName);
    
    if (index === -1) {
      showError(`Project "${projectName}" not found.`);
      return false;
    }
    
    const project = projects[index];
    imageInput.value = project.image || '';
    altInput.value = project.alt || '';
    descriptionInput.value = project.description || '';
    linkInput.value = project.link || '';
    dateInput.value = project.date || '';
    keywordsInput.value = project.keywords || '';
    
    showInfo(`Project "${projectName}" found and displayed above.`);
    return true;
  }

// Create operation
function createProject(projectData) {
  const projects = loadProjects();
  
  const existingIndex = findProjectIndexByName(projects, projectData.name);
  if (existingIndex !== -1) {
    showError(`Project with name "${projectData.name}" already exists. Use Update operation instead.`);
    return false;
  }
  
  projects.push(projectData);
  
  if (saveProjects(projects)) {
    showInfo(`Project "${projectData.name}" created successfully!`);
    crudForm.reset();
    updateFieldAvailability();
    return true;
  } else {
    showError('Failed to save project to localStorage.');
    return false;
  }
}



// Update operation
function updateProject(projectName, updatedData) {
  const projects = loadProjects();
  const index = findProjectIndexByName(projects, projectName);
  
  if (index === -1) {
    showError(`Project "${projectName}" not found. Cannot update.`);
    return false;
  }
  
  projects[index] = {
    ...projects[index],
    ...updatedData,
    name: projectName 
  };
  
  if (saveProjects(projects)) {
    showInfo(`Project "${projectName}" updated successfully!`);
    crudForm.reset();
    updateFieldAvailability();
    return true;
  } else {
    showError('Failed to save updated project to localStorage.');
    return false;
  }
}

// Delete operation
function deleteProject(projectName) {
  const projects = loadProjects();
  const index = findProjectIndexByName(projects, projectName);
  
  if (index === -1) {
    showError(`Project "${projectName}" not found. Cannot delete.`);
    return false;
  }
  
  if (!confirm(`Are you sure you want to delete project "${projectName}"?`)) {
    return false;
  }
  
  projects.splice(index, 1);
  
  if (saveProjects(projects)) {
    showInfo(`Project "${projectName}" deleted successfully!`);
    crudForm.reset();
    updateFieldAvailability();
    return true;
  } else {
    showError('Failed to save changes to localStorage.');
    return false;
  }
}


crudForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const operation = operationSelect.value;
  const projectName = projectNameInput.value.trim();
  
  if (!operation) {
    showError('Please select a CRUD operation.');
    return;
  }
  
  if (!projectName) {
    showError('Project name is required.');
    return;
  }
  
  // Build project data object
  const projectData = {
    name: projectName,
    image: imageInput.value.trim(),
    alt: altInput.value.trim(),
    description: descriptionInput.value.trim(),
    link: linkInput.value.trim(),
    date: dateInput.value.trim(),
    keywords: keywordsInput.value.trim()
  };
  
  let success = false;
  
  switch(operation) {
    case 'create':
      success = createProject(projectData);
      break;
      
    case 'read':
      success = readProject(projectName);
      break;
      
    case 'update':
      const { name, ...updatedData } = projectData;
      success = updateProject(projectName, updatedData);
      break;
      
    case 'delete':
      success = deleteProject(projectName);
      break;
  }
  
  // For read, we want to show the data but not submit the form
  if (success && (operation === 'create' || operation === 'update' || operation === 'delete')) {
    return;
  }
});

operationSelect.addEventListener('change', updateFieldAvailability);

document.addEventListener('DOMContentLoaded', updateFieldAvailability);


import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function CreateRecipePage() {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [recipeImg, setRecipeImg] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', { state: { from: '/create-recipe' } });
    }
  }, [userInfo, navigate]);

  // Handle file upload
  const handleImageUpload = (e) => {
    setRecipeImg(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!title || !category || !description || !ingredients || !instructions || !cookingTime || !recipeImg) {
      setError('Please fill in all fields');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split(',').map(item => item.trim())));
    formData.append('instructions', instructions);
    formData.append('cookingTime', cookingTime);
    formData.append('recipeImg', recipeImg);

    try {
      console.log("TOKEN", localStorage.getItem("token"))
      // Post the form data to the server
      await axios.post('/api/v1/recipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Redirect to home page on success
      navigate('/');
    } catch (error) {
      // Handle errors
      console.error('Failed to create recipe', error);
      console.log(error.message)
      setError('There was an error creating the recipe. Please try again.');
    }
  };

  if (!userInfo) return null; // Return nothing if the user is not authenticated

  return (
    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 className="text-center mb-4">Create a New Recipe</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data" style={{ background: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter recipe title"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Category:</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="Enter recipe category"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Description:</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter recipe description"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Ingredients (comma-separated):</Form.Label>
          <Form.Control
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            placeholder="Enter ingredients"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Instructions:</Form.Label>
          <Form.Control
            as="textarea"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            placeholder="Enter cooking instructions"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Cooking Time (in minutes):</Form.Label>
          <Form.Control
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
            placeholder="Enter cooking time"
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 'bold' }}>Recipe Image:</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageUpload}
            required
            style={{ borderRadius: '4px' }}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: '100%' }}>
          Create Recipe
        </Button>
      </Form>
    </Container>
  );
}

export default CreateRecipePage;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [recipeImg, setRecipeImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(`/api/v1/recipe/${id}`);
        if (data.userOwner !== userInfo._id) {
          alert('You are not authorized to edit this recipe.');
          navigate(`/recipe/${id}`);
          return;
        }

        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setIngredients(data.ingredients.join(', '));
        setInstructions(data.instructions);
        setCookingTime(data.cookingTime);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch recipe details', error);
        setError('There was an error fetching the recipe details.');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, userInfo._id, navigate]);

  const handleImageUpload = (e) => {
    setRecipeImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !description || !ingredients || !instructions || !cookingTime) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split(',').map(ingredient => ingredient.trim())));
    formData.append('instructions', instructions);
    formData.append('cookingTime', cookingTime);
    if (recipeImg) {
      formData.append('recipeImg', recipeImg);
    }

    try {
      await axios.put(`/api/v1/recipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error.response?.data || error.message);
      setError('Failed to update recipe. Please try again later.');
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Edit Recipe</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCategory" className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipe category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter recipe description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formIngredients" className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ingredients separated by commas"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formInstructions" className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter cooking instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCookingTime" className="mb-3">
          <Form.Label>Cooking Time (minutes)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter cooking time"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formRecipeImg" className="mb-3">
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageUpload}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: '100%' }}>
          Update Recipe
        </Button>
      </Form>
    </Container>
  );
}

export default EditRecipePage;

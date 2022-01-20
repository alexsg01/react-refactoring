import { useEffect, useState } from 'react';

import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodProps } from '../../interfaces/FoodProps';
import { Header } from '../../components/Header';

export function Dashboard() {

  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  useEffect(() => {
    async function fetchFoodApi() {
      const response = await api.get<FoodProps[]>('/foods')
      setFoods(response.data)
    }
    fetchFoodApi()
  },[])

  async function handleAddFood(food: Omit<FoodProps, 'id'>) {
    try {
      const response = await api.post('/foods', {
        ...food,
        avaliable: true
      })
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const foodUpdated = await api.put<FoodProps>(`/foods/${editingFood.id}`,
        { ...editingFood, ...food });

      const foodsUpdated = foods.map(f => f.id !== foodUpdated.data.id ? f : foodUpdated.data)

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)
    const foodsFiltered = foods.filter(food => food.id !== id)
    setFoods(foodsFiltered)
  }

  function toggleModal() { 
    console.log('DASHBOARD', modalOpen);
    setModalOpen(!modalOpen)
   }

  function toggleEditModal() {
    setModalEditOpen(!modalEditOpen)
  }

  function handleEditFood(food: FoodProps) {
    setEditingFood({ ...food })
    setModalEditOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood handleAddFood={handleAddFood} isOpen={modalOpen}
        setIsOpen={toggleModal} />
      <ModalEditFood editingFood={editingFood} isOpen={modalEditOpen}
        setIsOpen={toggleEditModal} handleUpdateFood={handleUpdateFood} />
      <FoodsContainer data-testid="foods-list">
        {
          foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleEditFood={handleEditFood}
              handleDelete={handleDeleteFood}
            />
          ))
        }
      </FoodsContainer>
    </>
  )

}
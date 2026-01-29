import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAppState() {
  const [inventory, setInventory] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales al inicio
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: inv } = await supabase
        .from('inventory')
        .select('*')
        .order('id');
      const { data: maint } = await supabase
        .from('maintenance')
        .select('*')
        .order('date', { ascending: false });

      if (inv) setInventory(inv);
      if (maint) setMaintenanceList(maint);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }

  // Agregar Equipo (Reemplaza handleAddItem )
  const addItem = async (newItem) => {
    const { data, error } = await supabase
      .from('inventory')
      .insert([{ ...newItem, last_maintenance: null }])
      .select();

    if (!error && data) {
      setInventory([...inventory, ...data]);
      return true;
    }
    return false;
  };

  // Agendar Mantenimiento (Reemplaza handleAddMaintenance )
  const addMaintenance = async (newMaint) => {
    // Buscamos el nombre del item seleccionado
    const selectedItem = inventory.find(
      (i) => i.id === parseInt(newMaint.itemId)
    );

    const { data, error } = await supabase
      .from('maintenance')
      .insert([
        {
          item_id: newMaint.itemId,
          item_name: selectedItem ? selectedItem.name : 'Desconocido',
          date: newMaint.date,
          type: newMaint.type,
          notes: newMaint.notes,
          status: 'Pendiente',
        },
      ])
      .select();

    if (!error && data) {
      setMaintenanceList([...maintenanceList, ...data]);
      return true;
    }
    return false;
  };

  // Completar Mantenimiento (Reemplaza completeMaintenance )
  const completeMaintenance = async (id) => {
    const { error } = await supabase
      .from('maintenance')
      .update({ status: 'Completado' })
      .eq('id', id);

    if (!error) {
      setMaintenanceList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'Completado' } : m))
      );
    }
  };

  return {
    inventory,
    maintenanceList,
    loading,
    addItem,
    addMaintenance,
    completeMaintenance,
  };
}

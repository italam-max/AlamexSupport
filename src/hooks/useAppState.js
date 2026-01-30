import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAppState() {
  const [inventory, setInventory] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: inv } = await supabase.from('inventory').select('*').order('id');
      const { data: maint } = await supabase.from('maintenance').select('*').order('date', { ascending: false });
      const { data: usrs } = await supabase.from('users').select('*').order('name');

      if (inv) setInventory(inv);
      if (maint) setMaintenanceList(maint);
      if (usrs) setUsers(usrs);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- INVENTARIO ---
  const addItem = async (newItem) => {
    const itemToSave = {
      ...newItem,
      assigned_to: newItem.assigned_to && newItem.assigned_to !== "" ? newItem.assigned_to : null,
      last_maintenance: null,
      specs: newItem.specs || {} 
    };

    const { data, error } = await supabase.from('inventory').insert([itemToSave]).select();

    if (error) {
      console.error("Error Supabase al crear item:", error.message);
      return false;
    }

    if (data) {
      setInventory([...inventory, ...data]);
      return true;
    }
    return false;
  };

  const updateItem = async (id, updates) => {
    const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).select();
    if (!error && data) {
      setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      return true;
    }
    return false;
  };

  // --- USUARIOS ---
  const addUser = async (newUser) => {
    const userToSave = {
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
        app_access_level: newUser.app_access_level || 'Soporte', 
        software_licenses: newUser.software_licenses || {}, 
        accessories: newUser.accessories || {},
        assigned_accounts: [] 
    };

    const { data, error } = await supabase.from('users').insert([userToSave]).select();
    
    if (!error && data) {
      setUsers([...users, ...data]);
      return true;
    } else {
        const mockUser = { ...userToSave, id: Date.now() };
        setUsers([...users, mockUser]);
        return true;
    }
  };

  const updateUser = async (id, updates) => {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select();
    if (!error && data) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      return true;
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      return true;
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } else {
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    }
  };

  // --- MANTENIMIENTO ---
  const addMaintenance = async (newMaint) => {
    const targetId = newMaint.item_id || newMaint.itemId;
    let targetName = newMaint.item_name || newMaint.itemName;
    
    if (!targetName) {
         const selectedItem = inventory.find(i => i.id == targetId);
         targetName = selectedItem ? selectedItem.name : 'Desconocido';
    }

    const targetStatus = newMaint.status || 'Pendiente';

    const objectToSave = {
      item_id: targetId,
      item_name: targetName,
      date: newMaint.date,
      type: newMaint.type,
      notes: newMaint.notes,
      status: targetStatus,
      // NUEVO: Guardamos quién registró la acción
      registered_by: newMaint.registered_by ? newMaint.registered_by : null
    };

    const { data, error } = await supabase.from('maintenance').insert([objectToSave]).select();

    if (!error && data) {
      setMaintenanceList(prev => [data[0], ...prev]);
      if (targetStatus === 'Completado') {
        updateInventoryLastMaintenance(targetId, newMaint.date);
      }
      return true;
    }
    return false;
  };

  const updateInventoryLastMaintenance = async (itemId, date) => {
     setInventory(prev => prev.map(item => item.id == itemId ? { ...item, last_maintenance: date } : item));
     await supabase.from('inventory').update({ last_maintenance: date }).eq('id', itemId);
  };

  const completeMaintenance = async (id) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('maintenance').update({ status: 'Completado' }).eq('id', id);
    
    if (!error) {
      let completedItem = null;
      setMaintenanceList((prev) => prev.map((m) => {
          if (m.id === id) {
            completedItem = m;
            return { ...m, status: 'Completado' };
          }
          return m;
        })
      );
      if (completedItem) {
        updateInventoryLastMaintenance(completedItem.item_id, today);
      }
    }
  };

  return {
    inventory, maintenanceList, users, 
    loading, 
    addItem, updateItem, 
    addUser, updateUser, deleteUser,
    addMaintenance, completeMaintenance,
  };
}
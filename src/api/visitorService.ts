import { supabase } from '../supabaseClient';

interface Visitor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  purpose?: string;
  visit_date?: string;
  status?: 'checked_in' | 'checked_out';
  check_in_time?: string;
  check_out_time?: string;
}

// 获取所有访客列表 (VisitorList.vue)
export const getVisitors = async () => {
    const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
};

// 常规访客签到 (VisitorSignIn.vue)
export const regularSignIn = async (visitorData: Partial<Visitor>) => {
    const { data, error } = await supabase
        .from('visitors')
        .insert([{
            ...visitorData,
            status: 'checked_in',
            check_in_time: new Date().toISOString(),
            visit_date: new Date().toISOString().split('T')[0]
        }]);
    if (error) throw new Error(error.message);
    return data;
};

// 快速访客签到 (QuickSignIn.vue)
export const quickSignIn = async (name: string, phone: string) => {
    const { data, error } = await supabase
        .from('visitors')
        .insert([{
            name,
            phone,
            status: 'checked_in',
            check_in_time: new Date().toISOString(),
            visit_date: new Date().toISOString().split('T')[0]
        }]);
    if (error) throw new Error(error.message);
    return data;
};

// 访客签出
export const checkOutVisitor = async (id: string) => {
    const { data, error } = await supabase
        .from('visitors')
        .update({
            status: 'checked_out',
            check_out_time: new Date().toISOString()
        })
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

// 更新访客信息
export const updateVisitor = async (id: string, updateData: Partial<Visitor>) => {
    const { data, error } = await supabase
        .from('visitors')
        .update(updateData)
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

// 删除访客记录
export const deleteVisitor = async (id: string) => {
    const { error } = await supabase
        .from('visitors')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);
};

// 按日期筛选访客
export const getVisitorsByDate = async (date: string) => {
    const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('visit_date', date)
        .order('check_in_time', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
};

// 搜索访客
export const searchVisitors = async (searchTerm: string) => {
    const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
};

// 获取当前在访的访客
export const getCurrentVisitors = async () => {
    const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('status', 'checked_in')
        .order('check_in_time', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
};

// 获取访客统计信息
export const getVisitorStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data: todayVisitors, error: todayError } = await supabase
        .from('visitors')
        .select('count')
        .eq('visit_date', today);
    
    const { data: currentVisitors, error: currentError } = await supabase
        .from('visitors')
        .select('count')
        .eq('status', 'checked_in');

    if (todayError || currentError) throw new Error('Failed to fetch visitor stats');
    
    return {
        todayCount: todayVisitors?.[0]?.count || 0,
        currentCount: currentVisitors?.[0]?.count || 0
    };
}; 
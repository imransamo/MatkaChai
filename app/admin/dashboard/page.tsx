import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin';
import type { ContactMessage, FranchiseLead, MenuCategory, MenuItem } from '@/lib/types';
import { createMenuItemAction, signOutAction, updateLeadStatusAction, updateMenuItemAction, updateMessageStatusAction } from '../actions';

export const metadata: Metadata = { title: 'Owner Dashboard', robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const { supabase, admin, user } = await requireAdmin();
  const [{ data: categories }, { data: items }, { data: leads }, { data: messages }] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_items').select('*').order('category_id').order('sort_order'),
    supabase.from('franchise_leads').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100),
  ]);

  const typedCategories = (categories || []) as MenuCategory[];
  const typedItems = (items || []) as MenuItem[];
  const typedLeads = (leads || []) as FranchiseLead[];
  const typedMessages = (messages || []) as ContactMessage[];

  return (
    <section className="admin-shell">
      <div className="admin-topbar">
        <div><span className="eyebrow">Matka Chai Owner Area</span><h1>Welcome, {admin.display_name || user.email}</h1></div>
        <form action={signOutAction}><button className="button button-maroon">Sign Out</button></form>
      </div>

      <div className="admin-metrics">
        <div><strong>{typedItems.length}</strong><span>Menu items</span></div>
        <div><strong>{typedLeads.filter((lead) => lead.status === 'new').length}</strong><span>New franchise leads</span></div>
        <div><strong>{typedMessages.filter((message) => message.status === 'new').length}</strong><span>New messages</span></div>
      </div>

      <details className="admin-panel" open>
        <summary><span>Menu Manager</span><small>Edit prices, descriptions and availability</small></summary>
        <div className="admin-panel-body">
          <div className="admin-menu-grid">
            {typedItems.map((item) => (
              <form key={item.id} action={updateMenuItemAction} className="admin-item-form">
                <input type="hidden" name="id" value={item.id} />
                <small>{typedCategories.find((category) => category.id === item.category_id)?.name || 'Category'}</small>
                <label>Name<input name="name" defaultValue={item.name} required /></label>
                <label>Description<textarea name="description" rows={2} defaultValue={item.description || ''} /></label>
                <div className="form-grid admin-mini-grid">
                  <label>Price<input name="price" type="number" min="0" step="1" defaultValue={item.price} required /></label>
                  <label>Order<input name="sort_order" type="number" defaultValue={item.sort_order} /></label>
                  <label>Badge<input name="badge" defaultValue={item.badge || ''} /></label>
                  <label>Image path<input name="image_url" defaultValue={item.image_url || ''} /></label>
                </div>
                <div className="checkbox-row"><label><input type="checkbox" name="is_active" defaultChecked={item.is_active} /> Available</label><label><input type="checkbox" name="is_signature" defaultChecked={item.is_signature} /> Signature</label></div>
                <button className="button button-small button-gold">Save Item</button>
              </form>
            ))}
          </div>
          <form action={createMenuItemAction} className="admin-create-form">
            <h3>Add a menu item</h3>
            <div className="form-grid">
              <label>Category<select name="category_id" required>{typedCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label>Name<input name="name" required /></label>
              <label>Price<input name="price" type="number" min="0" required /></label>
              <label>Sort order<input name="sort_order" type="number" defaultValue="99" /></label>
              <label>Badge<input name="badge" /></label>
              <label>Image path<input name="image_url" placeholder="/images/chai.svg" /></label>
            </div>
            <label>Description<textarea name="description" rows={3} /></label>
            <div className="checkbox-row"><label><input type="checkbox" name="is_active" defaultChecked /> Available</label><label><input type="checkbox" name="is_signature" /> Signature</label></div>
            <button className="button button-gold">Add Item</button>
          </form>
        </div>
      </details>

      <details className="admin-panel" open>
        <summary><span>Franchise Leads</span><small>{typedLeads.length} latest enquiries</small></summary>
        <div className="admin-panel-body table-wrap">
          <table className="admin-table"><thead><tr><th>Date</th><th>Applicant</th><th>Market</th><th>Investment</th><th>Format</th><th>Details</th><th>Status</th></tr></thead>
            <tbody>{typedLeads.map((lead) => <tr key={lead.id}>
              <td>{new Date(lead.created_at).toLocaleDateString('en-PK')}</td>
              <td><strong>{lead.full_name}</strong><br /><a href={`tel:${lead.phone}`}>{lead.phone}</a><br /><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
              <td>{lead.city}<br /><small>{lead.preferred_location || 'No exact site'}</small></td>
              <td>{lead.investment_range}<br /><small>Property: {lead.has_property ? 'Yes' : 'No'}</small></td>
              <td>{lead.format_interest}</td>
              <td><details><summary>Read</summary><p><strong>Experience:</strong> {lead.experience || '—'}</p><p><strong>Message:</strong> {lead.message || '—'}</p></details></td>
              <td><form action={updateLeadStatusAction} className="status-form"><input type="hidden" name="id" value={lead.id} /><select name="status" defaultValue={lead.status}><option value="new">New</option><option value="reviewing">Reviewing</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option></select><button>Update</button></form></td>
            </tr>)}</tbody>
          </table>
        </div>
      </details>

      <details className="admin-panel">
        <summary><span>Customer Messages</span><small>{typedMessages.length} latest messages</small></summary>
        <div className="admin-panel-body table-wrap">
          <table className="admin-table"><thead><tr><th>Date</th><th>Sender</th><th>Subject</th><th>Message</th><th>Status</th></tr></thead>
            <tbody>{typedMessages.map((message) => <tr key={message.id}>
              <td>{new Date(message.created_at).toLocaleDateString('en-PK')}</td>
              <td><strong>{message.name}</strong><br />{message.phone ? <a href={`tel:${message.phone}`}>{message.phone}</a> : null}<br />{message.email ? <a href={`mailto:${message.email}`}>{message.email}</a> : null}</td>
              <td>{message.subject}</td><td>{message.message}</td>
              <td><form action={updateMessageStatusAction} className="status-form"><input type="hidden" name="id" value={message.id} /><select name="status" defaultValue={message.status}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select><button>Update</button></form></td>
            </tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

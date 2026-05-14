import React from 'react';

const RightSidebar = () => {
  const contacts = [
    { id: 1, name: 'Aida Austin', status: 'online' },
    { id: 2, name: 'Luca Nicole', status: 'online' },
    { id: 3, name: 'Claire Eric', status: 'offline' },
    { id: 4, name: 'Reyna Chris', status: 'offline' },
  ];

  const groups = [
    { id: 1, name: 'UI Design Team', members: 4 },
    { id: 2, name: 'Motion graphic', members: 3 },
    { id: 3, name: 'Ux design team', members: 4 },
  ];

  return (
    <div className="right-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Contact</h3>
        <ul className="contact-list">
          {contacts.map(contact => (
            <li key={contact.id} className="contact-item">
              <div className="contact-avatar">{contact.name.charAt(0)}</div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
              </div>
              <div className={`status-dot ${contact.status === 'offline' ? 'offline' : ''}`} />
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Your Groups</h3>
        <ul className="group-list">
          {groups.map(group => (
            <li key={group.id} className="group-item">
              <div className="group-avatar">{group.name.charAt(0)}</div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="contact-status">{group.members} members</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;

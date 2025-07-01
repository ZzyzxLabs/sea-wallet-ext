import React from 'react';

interface ConnectionDialogProps {
  origin: string;
  onApprove: () => void;
  onReject: () => void;
}

const ConnectionDialog: React.FC<ConnectionDialogProps> = ({ origin, onApprove, onReject }) => {
  return (
    <div className="connection-dialog">
      <div className="dialog-header">
        <h2>Connection Request</h2>
      </div>
      <div className="dialog-content">
        <p><strong>{origin}</strong> wants to connect to your Sea Wallet.</p>
        <p>Connecting will allow this site to:</p>
        <ul>
          <li>View your wallet address</li>
          <li>Request approval for transactions</li>
          <li>Request message signing</li>
        </ul>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-reject" onClick={onReject}>Reject</button>
        <button className="btn btn-approve" onClick={onApprove}>Connect</button>
      </div>
    </div>
  );
};

export default ConnectionDialog;

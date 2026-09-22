/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import { MenuPage } from './components/MenuPage';
import { ConfirmationPage } from './components/ConfirmationPage';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/menu/table-12" replace />} />
          <Route path="/menu/:tableId" element={<MenuPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

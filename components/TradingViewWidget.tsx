// components/TradingViewWidget.tsx
'use client'
import { useEffect } from 'react';

const TradingViewWidget = () => {
  useEffect(() => {
    const containerId = 'tradingview';

    // Vérifier si le conteneur existe avant d'ajouter le script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      // Attendre que le conteneur soit bien présent
      const container = document.getElementById(containerId);
      if (container) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: 'PYTH:BTCUSD',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
        });
      } else {
        console.error('Le conteneur pour TradingView n\'existe pas');
      }
    };

    // Ajouter le script au DOM
    document.body.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage du composant
      document.body.removeChild(script);
    };
  }, []);

  return <div id="tradingview" style={{ height: '500px' }} />;
};

export default TradingViewWidget;

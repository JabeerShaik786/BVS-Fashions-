/**
 * BVS FASHIONS — WHATSAPP COMMERCE ORDERING ENGINE
 * 
 * Generates official WhatsApp click-to-chat links (https://wa.me/<number>?text=...)
 * with prefilled product order inquiries.
 */

import type { Product, ProductColor, CartItem } from '../types';

// Default configuration: BVS Fashions official WhatsApp number 8639778188 (+91)
export const DEFAULT_WHATSAPP_NUMBER = '918639778188';

export function getWhatsAppBusinessNumber(): string {
  const envNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER;
  if (envNumber && typeof envNumber === 'string') {
    // Sanitize: remove any spaces, +, or hyphens
    const sanitized = envNumber.replace(/[^0-9]/g, '');
    if (sanitized.length >= 10) return sanitized;
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export interface WhatsAppOrderParams {
  product: Product;
  selectedSize?: string;
  selectedColor?: ProductColor | string;
  quantity?: number;
}

/**
 * Builds the URL-encoded WhatsApp order message for a single product matching:
 * Hello BVS Fashions! I would like to order:
 *
 * Product: [Product Name]
 * Product ID: [SKU]
 * Price: ₹[Current Price]
 * Size: [Selected Size]
 * Color: [Selected Color]
 * Quantity: [Quantity]
 *
 * Please confirm availability, final price, and delivery details.
 */
export function buildProductWhatsAppMessage(params: WhatsAppOrderParams): string {
  const { product, selectedSize, selectedColor, quantity = 1 } = params;
  const currentPrice = product.price;

  const lines: (string | null)[] = [
    'Hello BVS Fashions! I would like to order:',
    '',
    `Product: ${product.name}`,
    `Product ID: ${product.sku || product.id}`,
    `Price: ₹${currentPrice.toLocaleString('en-IN')}`,
  ];

  if (selectedSize && selectedSize.trim() !== '') {
    lines.push(`Size: ${selectedSize}`);
  }

  const colorText = typeof selectedColor === 'string'
    ? selectedColor
    : selectedColor?.name;

  if (colorText && colorText.trim() !== '') {
    lines.push(`Color: ${colorText}`);
  }

  lines.push(`Quantity: ${quantity}`);

  if (product.fabric) {
    lines.push(`Fabric: ${product.fabric}`);
  }

  lines.push('');
  lines.push('Please confirm availability, final price, and delivery details.');

  return lines.filter((line) => line !== null).join('\n');
}

/**
 * Generates the full WhatsApp click-to-chat URL for ordering a product.
 */
export function generateWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const phone = getWhatsAppBusinessNumber();
  const message = buildProductWhatsAppMessage(params);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a WhatsApp order inquiry for all items currently in the shopping bag.
 */
export function buildCartWhatsAppMessage(items: CartItem[], subtotal: number): string {
  const lines = [
    `*NAMASTE BVS FASHIONS!* 🙏`,
    `I would like to order the following *${items.length} item(s)* from my shopping bag:`,
    ``,
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.product.name}*`,
      `   • SKU: ${item.product.sku || item.product.id}`,
      `   • Size: ${item.selectedSize} | Shade: ${item.selectedColor?.name || 'Default'}`,
      `   • Qty: ${item.quantity} × ₹${item.product.price.toLocaleString('en-IN')} = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`,
      ``
    );
  });

  lines.push(
    `*Total Order Value:* ₹${subtotal.toLocaleString('en-IN')}`,
    ``,
    `Please confirm availability of these traditional outfits and guide me on payment & shipping. Thank you!`
  );

  return lines.join('\n');
}

/**
 * Generates the WhatsApp URL for ordering the full cart.
 */
export function generateCartWhatsAppOrderUrl(items: CartItem[], subtotal: number): string {
  const phone = getWhatsAppBusinessNumber();
  const message = buildCartWhatsAppMessage(items, subtotal);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

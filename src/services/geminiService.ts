﻿/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import type { Restaurant, MenuItem, OrderDetails, CartItem } from '../types';

let ai: GoogleGenAI | null = null;

// This is the standard way to access environment variables in Vite.
// Make sure to set VITE_API_KEY in your Vercel project settings.
const apiKey = import.meta.env.VITE_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("VITE_API_KEY environment variable not set. Using fallback data and skipping AI generation.");
}

const fallbackRestaurants: Restaurant[] = [
    { id: '1', name: "熾熱鐵板燒", category: "現代美式料理", rating: 4.7, reviews: 345, deliveryTime: "25-35 分鐘", minOrder: 150, image: "https://picsum.photos/500/300?random=1" },
    { id: '2', name: "京都花開壽司", category: "日式料理 & 壽司", rating: 4.9, reviews: 512, deliveryTime: "30-40 分鐘", minOrder: 200, image: "https://picsum.photos/500/300?random=2" },
    { id: '3', name: "義大利麵萬歲", category: "義式料理 & 披薩", rating: 4.6, reviews: 420, deliveryTime: "20-30 分鐘", minOrder: 120, image: "https://picsum.photos/500/300?random=3" },
    { id: '4', name: "塔可真好吃", category: "墨西哥料理 & 塔可", rating: 4.5, reviews: 288, deliveryTime: "15-25 分鐘", minOrder: 80, image: "https://picsum.photos/500/300?random=4" },
    { id: '5', name: "正宗川菜館", category: "中式料理", rating: 4.8, reviews: 389, deliveryTime: "30-40 分鐘", minOrder: 180, image: "https://picsum.photos/500/300?random=5" },
    { id: '6', name: "法式甜點屋", category: "甜點 & 蛋糕", rating: 4.9, reviews: 267, deliveryTime: "20-30 分鐘", minOrder: 100, image: "https://picsum.photos/500/300?random=6" },
    { id: '7', name: "泰式風味", category: "泰式料理", rating: 4.4, reviews: 312, deliveryTime: "25-35 分鐘", minOrder: 150, image: "https://picsum.photos/500/300?random=7" },
    { id: '8', name: "健康蔬食", category: "素食 & 健康餐", rating: 4.6, reviews: 198, deliveryTime: "15-25 分鐘", minOrder: 120, image: "https://picsum.photos/500/300?random=8" },
];

const getFallbackMenu = (restaurantName: string): MenuItem[] => {
    const fallbackMenus: { [key: string]: MenuItem[] } = {
      "現代美式料理": [
        { id: 'm1', name: "經典漢堡", price: 180, restaurantName },
        { id: 'm2', name: "起司漢堡", price: 200, restaurantName },
        { id: 'm3', name: "薯條", price: 80, restaurantName },
        { id: 'm4', name: "奶昔", price: 120, restaurantName },
        { id: 'm5', name: "洋蔥圈", price: 90, restaurantName },
        { id: 'm6', name: "招牌沙拉", price: 150, restaurantName },
      ],
      "日式料理 & 壽司": [
        { id: 'm1', name: "綜合壽司拼盤", price: 320, restaurantName },
        { id: 'm2', name: "鮭魚生魚片", price: 280, restaurantName },
        { id: 'm3', name: "天婦羅烏龍麵", price: 220, restaurantName },
        { id: 'm4', name: "照燒雞肉飯", price: 180, restaurantName },
        { id: 'm5', name: "味噌湯", price: 60, restaurantName },
        { id: 'm6', name: "日式煎餃", price: 120, restaurantName },
      ],
      "義式料理 & 披薩": [
        { id: 'm1', name: "瑪格麗特披薩", price: 280, restaurantName },
        { id: 'm2', name: "培根蛋奶義大利麵", price: 240, restaurantName },
        { id: 'm3', name: "凱薩沙拉", price: 160, restaurantName },
        { id: 'm4', name: "蒜香麵包", price: 80, restaurantName },
        { id: 'm5', name: "提拉米蘇", price: 120, restaurantName },
        { id: 'm6', name: "義式濃縮咖啡", price: 60, restaurantName },
      ],
      "墨西哥料理 & 塔可": [
        { id: 'm1', name: "牛肉塔可", price: 120, restaurantName },
        { id: 'm2', name: "雞肉捲餅", price: 160, restaurantName },
        { id: 'm3', name: "酪梨醬", price: 80, restaurantName },
        { id: 'm4', name: "墨西哥玉米片", price: 100, restaurantName },
        { id: 'm5', name: "莎莎醬", price: 60, restaurantName },
        { id: 'm6', name: "墨西哥汽水", price: 50, restaurantName },
      ]
    };
    const category = Object.keys(fallbackMenus).find(cat => restaurantName.includes(cat.split(' ')[0]));
    return category ? fallbackMenus[category] : fallbackMenus["現代美式料理"];
};

export const generateRestaurantData = async (): Promise<Restaurant[]> => {
  if (!ai) return fallbackRestaurants;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "請為一個美食外送 App 生成一個包含8家多樣化且吸引人的虛構餐廳列表。請以繁體中文提供詳細資訊，例如：唯一的 ID、名稱、類別、評分(介於3.5到5.0之間)、評論數、外送時間預估、最低訂單金額，以及一個來自 picsum.photos 的佔位圖片 URL。",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "餐廳的唯一識別碼。" },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviews: { type: Type.INTEGER },
                  deliveryTime: { type: Type.STRING },
                  minOrder: { type: Type.INTEGER },
                  image: { type: Type.STRING, description: "一個來自 picsum.photos 的 URL，例如：https://picsum.photos/500/300" },
                },
                required: ["id", "name", "category", "rating", "reviews", "deliveryTime", "minOrder", "image"],
              },
            },
          },
        },
      },
    });
    const json = JSON.parse(response.text);
    return json.restaurants;
  } catch (error) {
    console.error("生成餐廳資料時發生錯誤:", error);
    return fallbackRestaurants;
  }
};

export const generateMenuForRestaurant = async (restaurantName: string): Promise<MenuItem[]> => {
    if (!ai) return getFallbackMenu(restaurantName);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `請為名為 "${restaurantName}" 的餐廳生成一份包含6個品項的真實菜單。對於每個品項，請提供唯一的 ID、名稱和價格。每個品項都應包含餐廳名稱以供參考。請使用繁體中文回答。`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        menu: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    price: { type: Type.NUMBER },
                                    restaurantName: { type: Type.STRING, description: "此品項所屬的餐廳名稱。" }
                                },
                                required: ["id", "name", "price", "restaurantName"],
                            },
                        },
                    },
                },
            },
        });
        const json = JSON.parse(response.text);
        return json.menu;
    } catch (error) {
        console.error(`為 ${restaurantName} 生成菜單時發生錯誤:`, error);
        return getFallbackMenu(restaurantName);
    }
};

export const processOrder = async (orderDetails: OrderDetails, cart: CartItem[]): Promise<{ orderNumber: string; estimatedDeliveryTime: string; }> => {
  if (!ai) {
      return {
          orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          estimatedDeliveryTime: "20-30 分鐘",
      };
  }
  try {
      const prompt = `一位顧客下了一張美食外送訂單。
      顧客資料: ${JSON.stringify(orderDetails)}。
      訂單品項: ${cart.map(item => `${item.name} x${item.quantity}`).join(', ')}。
      請根據這些資訊，生成一個唯一的訂單編號（格式：ORD-XXXXXX）和一個真實的預計送達時間（例如：25-35 分鐘）。`;

      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      orderNumber: { type: Type.STRING },
                      estimatedDeliveryTime: { type: Type.STRING },
                  },
                  required: ["orderNumber", "estimatedDeliveryTime"],
              },
          },
      });
      const json = JSON.parse(response.text);
      return json;
  } catch (error) {
      console.error("處理訂單時發生錯誤:", error);
      return {
          orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          estimatedDeliveryTime: "20-30 分鐘",
      };
  }
};

import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Check, Upload, FileCheck, AlertCircle, ArrowRight, Copy } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderNumber: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderNumber }) => {
  const { navigate, settings } = useApp();
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await api.trackOrder(orderNumber);
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadError(null);
      await api.uploadReceipt(orderNumber, selectedFile);
      setUploadSuccess(true);
      // Re-fetch order to show updated status
      await fetchOrder();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyInstapayAccount = () => {
    const acc = settings?.instapayAccount || 'quotes.store@instapay';
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
        LOCATING ORDER IDENTIFIER...
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-white">
        <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
          ORDER RECORD NOT FOUND
        </h2>
        <p className="text-xs font-mono text-neutral-400 mb-8 uppercase">
          {error || `No order matching ${orderNumber} exists.`}
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider"
        >
          RETURN TO ATELIER
        </button>
      </div>
    );
  }

  const isReceiptUploaded = orderData.hasReceiptUploaded;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-white min-h-screen">
      {/* Success Hero */}
      <div className="text-center pb-12 border-b border-white/10">
        <div className="w-12 h-12 bg-white text-black mx-auto mb-6 flex items-center justify-center">
          <Check className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
          ORDER SECURED &bull; AWAITING PAYMENT RECEIPT
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">
          THANK YOU
        </h1>
        <div className="mt-4 font-mono text-lg text-white">
          ORDER NUMBER: <span className="font-bold tracking-wider">{orderNumber}</span>
        </div>
        <p className="mt-2 text-xs font-mono text-neutral-400 max-w-lg mx-auto">
          Please complete your InstaPay transfer and upload the receipt below to begin fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-12">
        {/* Left: InstaPay Instructions & Upload Box */}
        <div className="md:col-span-7 space-y-8">
          {/* Step 1: Transfer via InstaPay */}
          <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
                STEP 1: TRANSFER VIA INSTAPAY
              </span>
              <span className="text-xs font-mono tabular-nums text-white font-bold">
                {orderData.totalAmount?.toLocaleString()} EGP
              </span>
            </div>

            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              {settings?.instapayInstructions ||
                'Transfer the exact total amount to our verified InstaPay account address.'}
            </p>

            <div className="p-3 bg-black/60 border border-white/10 flex justify-between items-center font-mono text-xs">
              <div>
                <span className="text-neutral-500 mr-2">ACCOUNT:</span>
                <span className="text-white font-semibold">
                  {settings?.instapayAccount || 'quotes.store@instapay'}
                </span>
              </div>
              <button
                type="button"
                onClick={copyInstapayAccount}
                className="text-neutral-400 hover:text-white flex items-center gap-1 uppercase text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAccount ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Upload Receipt */}
          <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
                STEP 2: UPLOAD PAYMENT RECEIPT
              </span>
              {isReceiptUploaded && (
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" />
                  <span>RECEIPT ATTACHED</span>
                </span>
              )}
            </div>

            {uploadError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                Payment receipt uploaded successfully! Our atelier administrators are reviewing your transfer.
              </div>
            )}

            {/* Drag & Drop Area */}
            {!filePreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-white/50 p-8 text-center cursor-pointer transition-colors bg-black/30"
              >
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <div className="text-xs font-mono uppercase tracking-wider text-white">
                  DRAG &amp; DROP PAYMENT RECEIPT
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1 uppercase">
                  OR CLICK TO CHOOSE FILE (PNG, JPG, WEBP)
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* Selected File Preview */
              <div className="border border-white/20 p-4 bg-black/60 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="truncate max-w-[200px] text-white">
                    {selectedFile?.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-neutral-400 hover:text-white uppercase text-[11px]"
                    >
                      REPLACE
                    </button>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 uppercase text-[11px]"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <img
                    src={filePreview}
                    alt="Receipt preview"
                    className="max-h-64 object-contain"
                  />
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleUploadSubmit}
                  className="w-full py-3 bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase hover:bg-neutral-200 transition-colors"
                >
                  {uploading ? 'SUBMITTING RECEIPT...' : 'CONFIRM & UPLOAD RECEIPT'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Status Summary */}
        <div className="md:col-span-5 bg-[#121212] border border-white/10 p-6 space-y-6 h-fit">
          <h2 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
            ORDER STATUS &bull; {orderData.orderStatus}
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>ORDER NUMBER</span>
              <span className="text-white">{orderData.orderNumber}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>PAYMENT STATUS</span>
              <span className="text-white">{orderData.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>DESTINATION</span>
              <span className="text-white">{orderData.shippingCity}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>TOTAL</span>
              <span className="text-white font-semibold tabular-nums">
                {orderData.totalAmount?.toLocaleString()} EGP
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => navigate(`/track-order?order=${orderData.orderNumber}`)}
              className="w-full py-3 px-4 border border-white/20 text-xs font-mono tracking-widest uppercase text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              <span>TRACK ORDER STATUS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full py-2.5 text-center text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors"
            >
              RETURN TO ATELIER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

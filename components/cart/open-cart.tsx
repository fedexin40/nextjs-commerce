import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function OpenCart({ quantity }: { quantity?: number }) {
  return (
    <div className="relative">
      <ShoppingCartIcon fontSize="large" />
      {quantity ? (
        <div className="absolute -right-2 -top-1 flex h-5 w-5 place-content-center rounded-full bg-white pt-0.5 text-[11px] font-medium shadow-xl shadow-black">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}

import Grid from 'components/grid';

export default function Loading() {
  return (
    <>
      <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
        <div className="flex w-full flex-row-reverse pb-12 pt-12">
          <div className="flex w-48 flex-row items-center gap-x-3 align-middle">
            <div className="h-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <Grid className="grid-cols-1 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
          {Array(12)
            .fill(0)
            .map((_, index) => {
              return <Grid.Item key={index} className="bg-neutral-100 dark:bg-neutral-900" />;
            })}
        </Grid>
      </div>
    </>
  );
}

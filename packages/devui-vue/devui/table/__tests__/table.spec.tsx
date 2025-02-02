import { mount } from '@vue/test-utils';
import DTable from '../src/table';
import DColumn from '../src/components/column/column';
import { nextTick } from 'vue';

let data: Array<Record<string, any>> = [];

describe('d-table', () => {
  beforeEach(() => {
    data = [
      {
        firstName: 'Jacob',
        lastName: 'Thornton',
        gender: 'Female',
        date: '1990/01/12',
      },
      {
        firstName: 'Mark',
        lastName: 'Otto',
        date: '1990/01/11',
        gender: 'Male',
      },
      {
        firstName: 'Danni',
        lastName: 'Chen',
        gender: 'Female',
        date: '1990/01/13',
      },
      {
        firstName: 'Green',
        lastName: 'Gerong',
        gender: 'Male',
        date: '1990/01/14',
      },
    ];
  });

  it('table render correctly', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    expect(table.exists()).toBeTruthy();
    const tableBody = table.find('.devui-table__tbody');
    expect(tableBody.findAll('tr').length).toBe(4);
    expect(tableBody.find('tr').findAll('td').length).toBe(4);
    wrapper.unmount();
  });

  it('checkable column', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="checkable"></DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableHeader = table.find('.devui-table__thead');
    expect(tableHeader.findAll('th')[0].classes()).toContain('devui-table__checkable-cell');
    const tableBody = table.find('.devui-table__tbody');
    expect(tableBody.find('tr').find('td').classes()).toContain('devui-table__checkable-cell');
    wrapper.unmount();
  });

  it('index column', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index"></DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableHeader = table.find('.devui-table__thead');
    expect(tableHeader.findAll('th')[0].find('.title').text()).toBe('#');
    const tableBody = table.find('.devui-table__tbody');
    expect(tableBody.find('tr').find('td').text()).toBe('1');
    wrapper.unmount();
  });

  it('column default slots', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index">{{ default: (scope) => `No.${scope.rowIndex + 1}` }}</DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableBody = table.find('.devui-table__tbody');
    expect(tableBody.find('tr').find('td').text()).toBe('No.1');
    wrapper.unmount();
  });

  it('column header slots', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index">{{ header: () => '序号' }}</DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableHeader = table.find('.devui-table__thead');
    expect(tableHeader.findAll('th')[0].find('.header-container').text()).toBe('序号');
    wrapper.unmount();
  });

  it('no data', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={[]}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableEmpty = table.find('.devui-table__empty');
    expect(tableEmpty.exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('merge cell', async () => {
    const wrapper = mount({
      setup() {
        const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
          if (rowIndex === 0 && columnIndex === 0) {
            return { rowspan: 1, colspan: 2 };
          }
        };
        return () => (
          <DTable data={data} span-method={spanMethod}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableBody = table.find('.devui-table__tbody');
    const firstTd = tableBody.find('tr').find('td');
    expect(firstTd.attributes('rowspan')).toBe('1');
    expect(firstTd.attributes('colspan')).toBe('2');
    wrapper.unmount();
  });

  it('multi header', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn header="Name">
              <DColumn field="firstName" header="First Name"></DColumn>
              <DColumn field="lastName" header="Last Name"></DColumn>
            </DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find('.devui-table');
    const tableHeader = table.find('.devui-table__thead');
    expect(tableHeader.findAll('tr').length).toBe(2);
    expect(tableHeader.findAll('tr')[0].findAll('th').length).toBe(3);
    expect(tableHeader.findAll('tr')[1].findAll('th').length).toBe(2);
    expect(tableHeader.findAll('tr')[0].findAll('th')[0].attributes('colspan')).toBe('2');
    expect(tableHeader.findAll('tr')[0].findAll('th')[1].attributes('rowspan')).toBe('2');
    wrapper.unmount();
  });

  it('sort', async () => {
    const handleSortChange = jest.fn();
    const wrapper = mount({
      setup() {
        const sortDateMethod = (a, b) => {
          return a.date > b.date;
        };
        return () => (
          <DTable data={data} onSortChange={handleSortChange}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth" sortable sort-direction="ASC" sort-method={sortDateMethod}></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();

    const table = wrapper.find('.devui-table');
    const tableHeader = table.find('.devui-table__thead');
    const lastTh = tableHeader.find('tr').findAll('th')[3];
    expect(lastTh.classes()).toContain('sort-active');

    const tableBody = table.find('.devui-table__tbody');
    const lastTd = tableBody.find('tr').findAll('td')[3];
    expect(lastTd.text()).toBe('1990/01/11');

    const sortIcon = lastTh.find('.sort-clickable');
    await sortIcon.trigger('click');
    expect(lastTd.text()).toBe('1990/01/14');
    expect(handleSortChange).toBeCalled();

    await sortIcon.trigger('click');
    expect(lastTd.text()).toBe('1990/01/12');
    expect(handleSortChange).toBeCalled();
  });
});

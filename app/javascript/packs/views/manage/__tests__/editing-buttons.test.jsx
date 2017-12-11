import React from 'react'
import renderer from 'react-test-renderer'
import EditingButtons from '../editing-buttons'

describe('#render', () => {
  it('should show snapshot', () => {
    const component = renderer.create(
      <EditingButtons onClickSend={() => {}} onClickCancel={() => {}} />,
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

const setVisible = (property, setIsVisible) => (v) => {
  property.isVisible = v;
  if (property.isFormItem && property.setFormItemVisible) property.setFormItemVisible(v);
  else setIsVisible(v);
};

export default {
  setVisible
}
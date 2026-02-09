import axios from 'axios';
import $ from 'jquery';
import 'jquery-mask-plugin';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  Filler
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  Filler
);

//VARIÁVEIS GLOBAIS DA APLICAÇÃO
window.app_url = import.meta.env.VITE_API_URL;
window.risco_altissimo = import.meta.env.VITE_RISCO_ALTISSIMO;
window.vulnerabilidade = import.meta.env.VITE_VULNERABILIDADE;

window.curto_prazo_minimo = import.meta.env.VITE_CURTO_PRAZO_MINIMO;
window.curto_prazo_maximo = import.meta.env.VITE_CURTO_PRAZO_MAXIMO;
window.medio_prazo_minimo = import.meta.env.VITE_MEDIO_PRAZO_MINIMO;
window.medio_prazo_maximo = import.meta.env.VITE_MEDIO_PRAZO_MAXIMO;
window.longo_prazo_minimo = import.meta.env.VITE_LONGO_PRAZO_MINIMO;
window.longo_prazo_maximo = import.meta.env.VITE_LONGO_PRAZO_MAXIMO;

//JQUERY
window.$ = $;

//TOM SELECT
window.TomSelect = TomSelect;

//AXIOS
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
window.axios = axios;

//SWEETALERT
window.Swal = Swal;

//CHART JS
window.Chart = Chart;




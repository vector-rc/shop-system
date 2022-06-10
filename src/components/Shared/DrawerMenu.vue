<template>
    <aside class="menu menu-container p-1 has-background-black-ter has-text-white-ter" style="font-weight: bold;">
        <div  style="width: 1.5rem;display: flex;padding: .5rem;width: 100%;">
            <img src="/src/assets/logo.png" alt="" style="width: 2rem;">
            <h2 style="color: #fff;font-size: 1.5rem;">Vilcherrez</h2>
        </div>
         <p class="menu-label">Productos</p>
        <ul class="menu-list">
            <li>
                <router-link to="/products">
                    <icon size="20">
                        <BoxMultiple20Filled />
                    </icon>
                    <span>Lista de Productos</span>
                </router-link>
            </li>
            <li>
                <router-link to="/newProduct">
                    <icon size="20">
                        <AppsAddIn20Filled/>
                    </icon>
                    <span>Agregar Producto</span>
                </router-link>
            </li>

        </ul>
        <p class="menu-label">VENTAS</p>
        <ul class="menu-list">
            <li>
                <router-link to="/sales">
                    <icon size="20">
                        <ShoppingBag20Filled/>
                    </icon>
                    <span>Lista de Ventas</span>
                </router-link>
            </li>
            <li>
                <router-link to="/newSale">
                    <icon size="20">
                        <Cart20Filled />
                    </icon>
                    <span>Nueva Venta</span>
                </router-link>
            </li>
        </ul>

        <p class="menu-label">Usuarios</p>
        <ul class="menu-list">
            <li>
                <router-link to="/signup">
                    <icon size="20">
                        <PersonAdd20Filled />
                    </icon>
                    <span>Nuevo Usuario</span>
                </router-link>
            </li>
            <li>
                <router-link to="/Users">
                    <icon size="20">
                        <People20Filled />
                    </icon>
                    <span>Usuarios</span>
                </router-link>
            </li>
        </ul>
   <!--     <p class="menu-label">Comprobantes de pago</p>
        <ul class="menu-list">
            <li>
                <router-link to="/boletas">
                    <icon size="20">
                        <BoxMultiple20Filled />
                    </icon>
                    <span>Boletas</span>
                </router-link>
            </li>
            <li>
                <router-link to="/facturas">
                    <icon size="20">
                        <People20Filled />
                    </icon>
                    <span>Facturas</span>
                </router-link>
            </li>
        </ul>
        <p class="menu-label">Reportes</p>
        <ul class="menu-list">
            <li>
                <router-link to="/boletasReport">
                    <icon size="20">
                        <BoxMultiple20Filled />
                    </icon>
                    <span>Boletas</span>
                </router-link>
            </li>
            <li>
                <router-link to="/facturasReport">
                    <icon size="20">
                        <People20Filled />
                    </icon>
                    <span>Facturas</span>
                </router-link>
            </li>
        </ul>
        -->
        <hr>
        <ul class="menu-list">
             <li>
                <router-link to="/reports">
                    <icon size="20">
                        <DocumentBulletList20Regular />
                    </icon>
                    <span>Reportes</span>
                </router-link>
            </li>
             <li>
                <router-link to="/printers">
                    <icon size="20">
                        <Settings20Filled />
                    </icon>
                    <span>Configuraciones</span>
                </router-link>
            </li>
            <li>
                <router-link to="/comprobante/consultar">
                    <icon size="20">
                        <DocumentBulletList20Regular />
                    </icon>
                    <span>Consultar Comprobantes</span>
                </router-link>
            </li>
            <li>
                <router-link to="/barcodes">
                    <icon size="20">
                        <BarcodeScanner20Filled />
                    </icon>
                    <span>Codigos de barra</span>
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<script setup lang="ts">
import { Icon } from '@vicons/utils'
import { BoxMultiple20Filled, Cart20Filled, ShoppingBag20Filled, BarcodeScanner20Filled, Settings20Filled, People20Filled, AppsAddIn20Filled, PersonAdd20Filled, DocumentBulletList20Regular } from '@vicons/fluent'

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding: 0;
    margin: 0;
}

</style>
